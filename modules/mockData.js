const mockStorage = {
    user: {
        id: "88",
        name: "Alfred Pennyworth",
        avatar: "https://example.com/avatar.jpg",
        activityPoints: 4800
    },
    
    cart: {
        items: [],
        totalPoints: 0
    },
    
    history: [
        {
            id: "#20250801000001",
            rewardId: "reward-001", 
            rewardName: "Voucher eMAG 250 RON",
            pointsSpent: 1000,
            quantity: 1,
            purchaseDate: Date.now() - 86400000 * 2,
            status: "completed",
            awbNumber: "AWBGENTECH12373324500"
        },
        {
            id: "#20250801000001",
            rewardId: "reward-003",
            rewardName: "Tricou GT Official", 
            pointsSpent: 150,
            quantity: 1,
            purchaseDate: Date.now() - 86400000 * 2,
            status: "completed",
            awbNumber: null
        }
    ],
    
    rewards: [
    {
      id: "1",
      name: "Tricou GenTech",
      description: "Tricou din bumbac cu logo Generația Tech. ",
      fullDescription: "Tricou unisex, 100% bumbac, produs in Romania. Cu logo GeneratiaTech.",
      price: 500,
      image: "placeholder.jpg",
      category: "GenTech",
      inStock: true,
      stockCount: 5
    },
    {
      id: "11",
      name: "Abonament 7Card",
      description: "Acces timp de o lună la rețeaua de săli și activități sportive 7Card.",
      fullDescription: "Abonament valabil 30 de zile, ce oferă acces la sute de locații partenere din țară: săli de fitness, piscine, clase de yoga, dans și multe altele. Perfect pentru a-ți menține echilibrul între muncă și sănătate. ",
      price: 1000,
      image: "https://i.postimg.cc/6QDb1d5b/7card-logo-well-color.webp",
      category: "Abonamente",
      inStock: true,
      stockCount: 5
    },
    {
      id: "12",
      name: "Abonament Netflix",
      description: " Acces premium la Netflix pentru o lună.",
      fullDescription: "Bucură-te timp de 30 de zile de filme, seriale și documentare pe una dintre cele mai populare platforme de streaming. Conținut variat, pentru toate gusturile",
      price: 1000,
      image: "https://i.postimg.cc/xCv5xhZq/netflix.jpg",
      category: "Abonamente",
      inStock: true,
      stockCount: 10
    },
    {
      id: "13",
      name: "Abonament Spotify Premium",
      description: "Muzică fără reclame și funcții premium timp de o lună.",
      fullDescription: "Acces la milioane de melodii și podcasturi, oƯline și fără întreruperi. Personalizează-ți playlisturile și bucură-te de sunet de calitate înaltă.",
      price: 1000,
      image: "https://i.postimg.cc/X7pFXtgF/spotify.jpg",
      category: "Abonamente",
      inStock: true,
      stockCount: 10
    },
    {
      id: "14",
      name: "Abonament Youtube Premium",
      description: "YouTube fără reclame și acces la YouTube Music timp de o lună.",
      fullDescription: "Experiență completă pe YouTube: vizionare fără reclame, redare în fundal și acces la YouTube Music Premium pentru streaming audio nelimitat.",
      price: 1000,
      image: "https://i.postimg.cc/vZwBMK2G/youtube.jpg",
      category: "Abonamente",
      inStock: true,
      stockCount: 10
    },
    {
      id: "15",
      name: "Abonament Canva Premium",
      description: "Funcții premium Canva pentru o lună.",
      fullDescription: "Deblochează șabloane exclusive, elemente grafice premium și funcții avansate de design. Ideal pentru proiecte creative, prezentări și social media.",
      price: 1000,
      image: "https://i.postimg.cc/QMHxqrHk/canva.jpg",
      category: "Abonamente",
      inStock: true,
      stockCount: 10
    },
    {
      id: "16",
      name: "Abonament Figma Pro",
      description: "Figma Pro timp de o lună pentru design colaborativ.",
      fullDescription: "Acces la funcțiile avansate Figma Pro pentru proiecte de UI/UX și colaborare în timp real. Perfect pentru designeri și echipe creative.",
      price: 1000,
      image: "https://i.postimg.cc/NFNzDZym/figma.jpg",
      category: "Abonamente",
      inStock: true,
      stockCount: 5
    },
    {
      id: "17",
      name: "Abonament Udemy",
      description: "Acces la cursuri online Udemy timp de o lună.",
      fullDescription: "Explorează mii de cursuri în domenii variate — programare, design, business, dezvoltare personală. Învață în ritmul tău, de oriunde.",
      price: 1000,
      image: "https://i.postimg.cc/05tWTRQJ/udemy.jpg",
      category: "Abonamente",
      inStock: true,
      stockCount: 5
    },
    {
      "id": "18",
      "name": "Abonament Discord Nitro",
      "description": "Discord Nitro pentru o lună, cu funcții premium.",
      "fullDescription": "Beneficiază de emoji personalizate, uploaduri mai mari, streaming de calitate și personalizare avansată a profilului.",
      "price": 1000,
      "image": "https://cdn.prod.website-files.com/5f9072399b2640f14d6a2bf4/666cbcfd14d3f28b5309dd93_image5.png",
      "category": "Abonamente",
      "inStock": true,
      "stockCount": 10
    },
    {
      "id": "19",
      "name": "Sesiune 1:1 cu mentorul",
      "description": "Discuție individuală de o oră cu mentorul tău.",
      "fullDescription": " O întâlnire personalizată în care poți cere sfaturi, direcții de carieră și recomandări pentru următorii pași. Potrivită pentru clarificarea obiectivelor și accelerarea progresului.",
      "price": 2000,
      "image": "https://i.postimg.cc/MGWG4rdX/sesiune-11.jpg",
      "category": "Cariera",
      "inStock": true,
      "stockCount": 2
    },
    {
      "id": "2",
      "name": "Cana GenTech",
      "description": "Cană ceramică Generația Tech.",
      "fullDescription": "Perfecta pentru cafeaua de dimineata! O cana de 250ml, imprimata cu logo-ul  Generatia Tech",
      "price": 200,
      "image": "placeholder.jpg",
      "category": "GenTech",
      "inStock": true,
      "stockCount": 12
    },
    {
      "id": "20",
      "name": "Simulare Interviu + Feedback",
      "description": "Simulare interviu cu evaluare detaliată. ",
      "fullDescription": "Participă la un interviu fictiv realizat de profesioniști din HR și primește feedback imediat, cu recomandări clare de îmbunătățire.",
      "price": 2500,
      "image": "https://i.postimg.cc/BnhvrByg/simulare-interviu.jpg",
      "category": "Cariera",
      "inStock": true,
      "stockCount": 2
    },
    {
      "id": "21",
      "name": "Practică de 1 Săptămână",
      "description": "Experiență practică timp de o săptămână la un partener GT.",
      "fullDescription": " Implică-te într-un mini-proiect real, în cadrul unei echipe, pentru a acumula experiență relevantă și conexiuni profesionale.",
      "price": 3500,
      "image": "https://i.postimg.cc/05pyksFr/practica.jpg",
      "category": "Cariera",
      "inStock": true,
      "stockCount": 2
    },
    {
      "id": "22",
      "name": "Review portofoliu",
      "description": "Analiză detaliată a portofoliului tău.",
      "fullDescription": "Mentorul verifică structura, prezentarea și relevanța proiectelor din portofoliu, oferind un raport cu sugestii de optimizare.",
      "price": 1000,
      "image": "https://i.postimg.cc/WbNTsJ0f/portofolio-review.jpg",
      "category": "Cariera",
      "inStock": true,
      "stockCount": 1
    },
    {
      "id": "23",
      "name": "Review profil GitHub",
      "description": "Verificare și recomandări pentru profilul tău GitHub.",
      "fullDescription": "Evaluare completă a repo-urilor și a modului de prezentare a proiectelor, cu idei pentru îmbunătățire și profesionalizare",
      "price": 1000,
      "image": "https://i.postimg.cc/brcpzcC8/github-profile-review.jpg",
      "category": "Cariera",
      "inStock": true,
      "stockCount": 1
    },
    {
      "id": "24",
      "name": "Proiect comun cu mentorul",
      "description": "Lucrează la un proiect de la A la Z alături de mentor.",
      "fullDescription": " Experiență colaborativă în care primești taskuri, suport și îndrumare directă pentru realizarea unui proiect complex, specific track-ului tău.",
      "price": 2500,
      "image": "https://i.postimg.cc/kM8v7278/proiect-cu-mentor.jpg",
      "category": "Cariera",
      "inStock": true,
      "stockCount": 1
    },
    {
      "id": "25",
      "name": "Promovare cursant SM",
      "description": "Promovare pe canalele Generația Tech și parteneri.",
      "fullDescription": "Vizibilitate profesională prin postări și recomandări în social media și către partenerii noștri.",
      "price": 3000,
      "image": "https://i.postimg.cc/Wb8r4rCD/promovare-sm.jpg",
      "category": "Cariera",
      "inStock": true,
      "stockCount": 1
    },
    {
      "id": "26",
      "name": "Zi de shadowing",
      "description": "O zi petrecută alături de un profesionist din domeniu.",
      "fullDescription": "Observă direct activitatea zilnică, procesele și stilul de lucru al unui expert, pentru a înțelege cerințele reale din industrie.",
      "price": 1750,
      "image": "https://i.postimg.cc/NjyMwHcv/shadowing.jpg",
      "category": "Cariera",
      "inStock": true,
      "stockCount": 3
    },
    {
      "id": "27 ",
      "name": "Pixel Buds 2 Pro",
      "description": "Căști wireless Pixel Buds Pro 2.",
      "fullDescription": "Sunet clar, funcție de anulare activă a zgomotului și design ergonomic pentru confort maxim.",
      "price": 3000,
      "image": "https://i.postimg.cc/Wb0TVLWS/pixel-buds.jpg",
      "category": "Comori",
      "inStock": true,
      "stockCount": 1
    },
    {
      "id": "28",
      "name": "Controller Xbox",
      "description": "Controller wireless Xbox.",
      "fullDescription": " Conectivitate rapidă, design optimizat și compatibilitate cu multiple platforme pentru o experiență de gaming excelentă.",
      "price": 3500,
      "image": "https://i.postimg.cc/7PMKrK10/controller-xbox.jpg",
      "category": "Comori",
      "inStock": true,
      "stockCount": 3
    },
    {
      "id": "29",
      "name": "Încărcător wireless",
      "description": "Încărcător rapid fără fir.",
      "fullDescription": "Tehnologie Qi pentru încărcare rapidă și sigură a dispozitivelor compatibile.",
      "price": 3000,
      "image": "https://i.postimg.cc/13LGqFcy/wireless-charger.jpg",
      "category": "Comori",
      "inStock": true,
      "stockCount": 5
    },
    {
      "id": "3",
      "name": "Stickere GenTech",
      "description": "Set de 50 de stickere Generația Tech.",
      "fullDescription": "Include logo-ul, mascotele și elemente vizuale specifice comunității GT.",
      "price": 100,
      "image": "placeholder.jpg",
      "category": "GenTech",
      "inStock": true,
      "stockCount": 20
    },
    {
      "id": "30",
      "name": "Badge \"Pescar\"",
      "description": "Badge vizibil pe Leaderboards.",
      "fullDescription": "Distincție digitală ce apare lângă numele tău pe Leaderboards, arătând că ai acumulat suficiente puncte pentru acest titlu.",
      "price": 15,
      "image": "pescar.jpg",
      "category": "Decoratiuni",
      "inStock": true,
      "stockCount": 5
    },
    {
      "id": "31",
      "name": "  \t Badge \"Chill guy\"",
      "description": "Badge vizibil pe Leaderboards.",
      "fullDescription": "Distincție digitală ce apare lângă numele tău pe Leaderboards, arătând că ai acumulat suficiente puncte pentru acest titlu.",
      "price": 15,
      "image": "https://m.media-amazon.com/images/I/51AG-bntwIL._UF350,350_QL80_.jpg",
      "category": "Decoratiuni",
      "inStock": true,
      "stockCount": 5
    },
    {
      "id": "32",
      "name": "Badge \"Chill girl\"",
      "description": "Badge vizibil pe Leaderboards.",
      "fullDescription": "Distincție digitală ce apare lângă numele tău pe Leaderboards, arătând că ai acumulat suficiente puncte pentru acest titlu.",
      "price": 15,
      "image": "https://ih1.redbubble.net/image.5708864572.7228/st,small,507x507-pad,600x600,f8f8f8.jpg",
      "category": "Decoratiuni ",
      "inStock": true,
      "stockCount": 5
    },
    {
      "id": "33",
      "name": "Badge \"Surfer\"",
      "description": "Badge vizibil pe Leaderboards.",
      "fullDescription": "Distincție digitală ce apare lângă numele tău pe Leaderboards, arătând că ai acumulat suficiente puncte pentru acest titlu.",
      "price": 15,
      "image": "surfer.jpg",
      "category": "Decoratiuni ",
      "inStock": true,
      "stockCount": 5
    },
    {
      "id": "34",
      "name": "Badge \"Rosu\"",
      "description": "Badge vizibil pe Leaderboards.",
      "fullDescription": "Distincție digitală ce apare lângă numele tău pe Leaderboards, arătând că ai acumulat suficiente puncte pentru acest titlu.",
      "price": 15,
      "image": "rosu.jpeg?",
      "category": "Decoratiuni",
      "inStock": true,
      "stockCount": 5
    },
    {
      "id": "35",
      "name": "Badge \"Sunglasses\"",
      "description": "Badge vizibil pe Leaderboards.",
      "fullDescription": "Distincție digitală ce apare lângă numele tău pe Leaderboards, arătând că ai acumulat suficiente puncte pentru acest titlu.",
      "price": 15,
      "image": "https://eu-images.contentstack.com/v3/assets/blt7dcd2cfbc90d45de/bltca0defe0e9c1b630/67b844be273493d43a833ed1/28513-1.jpg?format=pjpg&auto=webp&quality=75%2C90&width=3840",
      "category": "Decoratiuni",
      "inStock": true,
      "stockCount": 5
    },
    {
      id: "36",
      name: "Badge \"Gemini\"",
      description: "Badge vizibil pe Leaderboards.",
      fullDescription: "Distincție digitală ce apare lângă numele tău pe Leaderboards, arătând că ai acumulat suficiente puncte pentru acest titlu.",
      price: 15,
      image: "https://i.pinimg.com/736x/f6/40/d6/f640d61bfdb9be2ec29d7261ad02315a.jpg",
      category: "Decoratiuni",
      inStock: true,
      stockCount: 5
    },
    {
      id: "37",
      name: "Border Foc",
      description: "Efect vizual „foc” pe Leaderboards.",
      fullDescription: "Adaugă un cerc de foc în jurul iconiței tale, pentru un profil care iese în evidență.",
      price: 25,
      image: "firenationattacked.jpg",
      category: "Decoratiuni",
      inStock: true,
      stockCount: 5
    },
    {
      id: "38",
      name: "Rank Discord \"Color\"",
      description: "Nume colorat pe serverul Discord GT.",
      fullDescription: "Personalizează culoarea numelui tău pe Discord, pentru un aspect unic și recognoscibil.",
      price: 30,
      image: "https://i.postimg.cc/2S5Sdj7y/discord.jpg",
      category: "Decoratiuni",
      inStock: true,
      stockCount: 100
    },
    {
      id: "39",
      name: "Voucher eMAG 150",
      description: "Voucher eMAG în valoare de 150 de lei.",
      fullDescription: "Utilizabil pentru cumpărături pe eMAG, valabil conform termenilor și condițiilor magazinului.",
      price: 1500,
      image: "https://i.postimg.cc/qgV2hh3N/emag.png",
      category: "Voucher",
      inStock: true,
      stockCount: 5
    },
    {
      id: "4",
      name: "Agenda GenTech",
      description: "Agendă 2026 cu branding GT.",
      fullDescription: "Agendă cu design minimalist, ideală pentru planificare și notițe.",
      price: 150,
      image: "placeholder.jpg",
      category: "GenTech",
      inStock: true,
      stockCount: 15
    },
    {
      id: "40",
      name: "Voucher eMAG 100",
      description: "Voucher eMAG în valoare de 100 de lei.",
      fullDescription: "Utilizabil pentru cumpărături pe eMAG, valabil conform termenilor și condițiilor magazinului.",
      price: 1000,
      image: "https://i.postimg.cc/qgV2hh3N/emag.png",
      category: "Voucher",
      inStock: true,
      stockCount: 5
    },
    {
      id: "41",
      name: "Voucher eMAG 200",
      description: "Voucher eMag în valoare de 200 de lei.",
      fullDescription: "Utilizabil pentru cumpărături pe eMAG, valabil conform termenilor și condițiilor magazinului.",
      price: 2000,
      image: "https://i.postimg.cc/qgV2hh3N/emag.png",
      category: "Voucher",
      inStock: true,
      stockCount: 4
    },
    {
      id: "42",
      name: "Voucher eMAG 300",
      description: "Voucher eMAG în valoare de 300 de lei.",
      fullDescription: "Utilizabil pentru cumpărături pe eMAG, valabil conform termenilor și condițiilor magazinului.",
      price: 3000,
      image: "https://i.postimg.cc/qgV2hh3N/emag.png",
      category: "Voucher",
      inStock: true,
      stockCount: 2
    },
    {
      id: "43",
      name: "Voucher Miele 100",
      description: "Voucher Miele în valoare de 100 de lei.",
      fullDescription: " Folosibil pentru achiziția produselor Miele, inclusiv electrocasnice și accesorii.",
      price: 1000,
      image: "https://i.postimg.cc/1XprKrPG/miele.png",
      category: "Voucher",
      inStock: true,
      stockCount: 5
    },
    {
      id: "44",
      name: "Voucher Miele 200",
      description: "Voucher Miele în valoare de 200 de lei.",
      fullDescription: "Folosibil pentru achiziția produselor Miele, inclusiv electrocasnice și accesorii.",
      price: 2000,
      image: "https://i.postimg.cc/1XprKrPG/miele.png",
      category: "Voucher",
      inStock: true,
      stockCount: 3
    },
    {
      id: "45",
      name: "Voucher Miele 300",
      description: "Voucher Miele în valoare de 300 de lei.",
      fullDescription: "Folosibil pentru achiziția produselor Miele, inclusiv electrocasnice și accesorii.",
      price: 3000,
      image: "https://i.postimg.cc/1XprKrPG/miele.png",
      category: "Voucher",
      inStock: true,
      stockCount: 2
    },
    {
      id: "46",
      name: "Voucher Kaufland 100",
      description: "Voucher Kaufland în valoare de 100 de  lei",
      fullDescription: "Poate fi utilizat pentru cumpărături în magazinele Kaufland din România.",
      price: 1000,
      image: "https://i.postimg.cc/5thzkQsn/kaufland.png",
      category: "Voucher",
      inStock: true,
      stockCount: 4
    },
    {
      id: "5",
      name: "Pix GenTech",
      description: "Pix albastru Generația Tech.",
      fullDescription: "Pix ergonomic, cu cerneală de calitate și design simplu, marcat cu logo GT. ",
      price: 100,
      image: "placeholder.jpg",
      category: "GenTech",
      inStock: true,
      stockCount: 40
    },
    {
      id: "6",
      name: "Rucsac GenTech",
      description: "Rucsac de drumeție cu logo GT",
      fullDescription: "Spațios, rezistent și confortabil, ideal pentru deplasări zilnice sau excursii. ",
      price: 400,
      image: "placeholder.jpg",
      category: "GenTech",
      inStock: true,
      stockCount: 5
    },
    {
      id: "60",
      name: "Philips Smart LED Strip",
      description: "Bandă LED inteligentă Philips.",
      fullDescription: "Iluminare personalizabilă, controlabilă prin aplicație sau asistent vocal, ideală pentru decor modern.",
      price: 4000,
      image: "https://hueblog.com/wp-content/uploads/2021/09/Hue-Sync-Gradient.jpg",
      category: "Comori",
      inStock: true,
      stockCount: 5
    }
    ],
    
    networkDelay: () => new Promise(resolve => 
        setTimeout(resolve, Math.random() * 1000 + 500)
    )
};

const findRewardById = (id) => {
    return mockStorage.rewards.find(reward => reward.id === id);
};

const generateTransactionId = () => {
    return `#${Date.now().toString().slice(-10)}${Math.random().toString().slice(-3)}`;
};

const generateAWBNumber = () => {
    return `AWBGENTECH${Math.random().toString().slice(2, 13)}`;
};

export const mockUserProfile = async () => {
    await mockStorage.networkDelay();
    return { ...mockStorage.user };
};

export const mockRewards = async () => {
    await mockStorage.networkDelay();
    return {
        rewards: [...mockStorage.rewards]
    };
};

export const mockCart = async () => {
    await mockStorage.networkDelay();
    return { ...mockStorage.cart };
};

export const mockAddToCart = async (rewardId, quantity = 1) => {
    await mockStorage.networkDelay();
    
    const reward = findRewardById(rewardId);
    if (!reward) {
        throw new Error(`Produsul cu ID ${rewardId} nu a fost găsit`);
    }
    
    if (!reward.inStock || reward.stockCount < quantity) {
        return {
            success: false,
            message: "Produsul nu este disponibil în cantitatea dorită",
            cart: { ...mockStorage.cart }
        };
    }
    
    const existingItem = mockStorage.cart.items.find(item => item.rewardId === rewardId);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        mockStorage.cart.items.push({
            rewardId,
            name: reward.name,
            price: reward.price,
            quantity,
            image: reward.image
        });
    }
    
    mockStorage.cart.totalPoints = mockStorage.cart.items.reduce(
        (total, item) => total + (item.price * item.quantity), 0
    );
    
    return {
        success: true,
        message: "Produs adăugat în coș cu succes",
        cart: { ...mockStorage.cart }
    };
};

export const mockCheckout = async (items) => {
    await mockStorage.networkDelay();
    
    if (!items || items.length === 0) {
        return {
            success: false,
            message: "Coșul este gol",
            newBalance: mockStorage.user.activityPoints
        };
    }
    
    const totalCost = mockStorage.cart.totalPoints;
    
    if (mockStorage.user.activityPoints < totalCost) {
        return {
            success: false,
            message: `Nu ai suficiente puncte. Ai nevoie de ${totalCost} AP, dar ai doar ${mockStorage.user.activityPoints} AP.`,
            newBalance: mockStorage.user.activityPoints
        };
    }
    
    const orderId = generateTransactionId();
    
    const purchasedItems = mockStorage.cart.items.map(item => {
        const reward = findRewardById(item.rewardId);
        
        if (reward) {
            reward.stockCount -= item.quantity;
            if (reward.stockCount <= 0) {
                reward.inStock = false;
                reward.stockCount = 0;
            }
        }
        
        return {
            id: orderId,
            rewardId: item.rewardId,
            rewardName: item.name,
            pointsSpent: item.price * item.quantity,
            quantity: item.quantity,
            purchaseDate: Date.now(),
            status: "completed",
            awbNumber: reward?.isPhysical ? generateAWBNumber() : null
        };
    });
    
    mockStorage.user.activityPoints -= totalCost;
    mockStorage.history.push(...purchasedItems);
    mockStorage.cart.items = [];
    mockStorage.cart.totalPoints = 0;
    
    return {
        success: true,
        message: `Achiziție finalizată cu succes! Ai cheltuit ${totalCost} AP.`,
        newBalance: mockStorage.user.activityPoints,
        purchasedItems,
        transactionId: orderId
    };
};

export const mockHistory = async () => {
    await mockStorage.networkDelay();
    return {
        purchases: [...mockStorage.history].reverse()
    };
};

export const resetMockData = () => {
    mockStorage.user.activityPoints = 2000;
    mockStorage.cart.items = [];
    mockStorage.cart.totalPoints = 0;
    mockStorage.history = [];
    
    mockStorage.rewards.forEach(reward => {
        reward.inStock = true;
        switch(reward.id) {
            case "reward-001": reward.stockCount = 50; break;
            case "reward-002": reward.stockCount = 3; break; 
            case "reward-003": reward.stockCount = 100; break;
            case "reward-004": reward.stockCount = 25; break;
            case "reward-005": reward.stockCount = 5; reward.inStock = true; break;
        }
    });
};

export const getMockStorage = () => ({ ...mockStorage });

if (typeof window !== 'undefined') {
    window.mockStorage = mockStorage;
    window.resetMockData = resetMockData;
}