import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, updateDoc, doc } from 'firebase/firestore';

// Need to use the same firebase config
import firebaseConfig from '../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

const VALID_CATEGORIES = ['환율', 'ETF', '경제 기초', '미국 증시', '세금/지원금'];

async function migrate() {
  const querySnapshot = await getDocs(collection(db, 'posts'));
  
  for (const document of querySnapshot.docs) {
    const data = document.data();
    let updated = false;
    const updates: any = {};

    // 1. Migrate Category
    if (!VALID_CATEGORIES.includes(data.category)) {
      // Default to the first one or try to map
      let newCategory = '경제 기초'; // Default fallback
      const oldCat = (data.category || '').toLowerCase();
      if (oldCat.includes('환율') || oldCat.includes('exchange')) newCategory = '환율';
      else if (oldCat.includes('etf')) newCategory = 'ETF';
      else if (oldCat.includes('미국') || oldCat.includes('증시')) newCategory = '미국 증시';
      else if (oldCat.includes('세금') || oldCat.includes('지원금')) newCategory = '세금/지원금';
      
      updates.category = newCategory;
      updated = true;
    }

    // 2. Set default language if missing
    if (!data.language) {
      updates.language = 'ko';
      updated = true;
    }

    // 3. Set default flowType if missing
    if (data.flowType === undefined) {
      updates.flowType = '';
      updated = true;
    }

    if (updated) {
      console.log(`Updating post ${document.id} (${data.title})`);
      await updateDoc(doc(db, 'posts', document.id), updates);
    }
  }
  console.log('Migration complete.');
}

migrate().catch(console.error);
