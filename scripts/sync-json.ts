import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../src/firebase';
import { writeJsonArtifacts } from '../src/lib/sync-json-artifacts';

function normalizeFirestoreValue(value: any): any {
  if (value == null) return value;
  if (typeof value?.toDate === 'function') {
    return value.toDate().toISOString();
  }
  if (value instanceof Date) {
    return value.toISOString();
  }
  if (Array.isArray(value)) {
    return value.map(normalizeFirestoreValue);
  }
  if (typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, nestedValue]) => [key, normalizeFirestoreValue(nestedValue)])
    );
  }
  return value;
}

function normalizeFirestorePosts(posts: any[]) {
  return posts.map((post: any, index: number) => ({
    ...normalizeFirestoreValue(post),
    id: post.id ?? post.slug ?? String(index + 1),
  }));
}

function filterPublicPosts(posts: any[]) {
  const now = new Date();
  return posts
    .filter(post => {
      if (post.status !== 'published') return false;
      const publishDate = post.publishDate ? new Date(post.publishDate) : null;
      if (publishDate && publishDate > now) return false;
      return true;
    })
    .sort((a, b) => {
      const dateA = new Date(a.publishDate || a.createdAt).getTime();
      const dateB = new Date(b.publishDate || b.createdAt).getTime();
      return dateB - dateA;
    });
}

async function main() {
  console.log('Starting local sync-json script...');
  console.log('Reading posts from Firestore...');

  const firestoreQuery = query(collection(db, 'posts'), where('status', '==', 'published'));
  const snapshot = await getDocs(firestoreQuery);
  const firestorePosts = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));
  const normalizedPosts = normalizeFirestorePosts(firestorePosts);
  const publicPosts = filterPublicPosts(normalizedPosts);

  console.log(`Loaded ${firestorePosts.length} published posts from Firestore.`);
  console.log(`Fetched ${publicPosts.length} published posts from Firestore.`);

  writeJsonArtifacts(publicPosts);
  console.log('Local sync-json complete.');
}

main().catch((error) => {
  console.error('Local sync-json failed:', error);
  process.exit(1);
});
