// import { isPhysicalProduct } from "./addressModal";

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
      image: "https://tse1.mm.bing.net/th/id/OIP.7HEf7nj4Omi52_mZgMf1KQHaHQ?pid=Api&P=0&h=220",
      category: "GenTech",
      inStock: true,
      stockCount: 5,
      physical: true
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
      id: "36",
      name: "Badge",
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
      image: "https://tse4.mm.bing.net/th/id/OIP.2B7q6eRAI0kc1YZ25pNS7gHaHa?pid=Api&P=0&h=220",
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
      fullDescription: "Util pentru cumpărături în valoare de 150 RON pe eMAG, valabil conform termenilor și condițiilor magazinului.",
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
      image: "https://tse1.mm.bing.net/th/id/OIP.FRSE9IkyY5NPIHqynM9TvwHaGN?pid=Api&P=0&h=220",
      category: "GenTech",
      inStock: true,
      stockCount: 15,
      physical: true
    },
    {
      id: "40",
      name: "Voucher eMAG 100",
      description: "Voucher eMAG în valoare de 100 de lei.",
      fullDescription: "Util pentru cumpărături în valoare de 100 RON pe eMAG, valabil conform termenilor și condițiilor magazinului.",
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
      fullDescription: "Util pentru cumpărături în valoare de 200 RON pe eMAG, valabil conform termenilor și condițiilor magazinului.",
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
      fullDescription: "Util pentru cumpărături în valoare de 300 RON pe eMAG, valabil conform termenilor și condițiilor magazinului.",
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
      fullDescription: " Util pentru achiziția produselor Miele în valoare de 100 RON, inclusiv electrocasnice și accesorii.",
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
      fullDescription: "Util pentru achiziția produselor Miele în valoare de 200 RON, inclusiv electrocasnice și accesorii.",
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
      fullDescription: "Util pentru achiziția produselor Miele în valoare de 200 RON, inclusiv electrocasnice și accesorii.",
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
      fullDescription: "Poate fi utilizat pentru cumpărături în valoare de 100 RON în magazinele Kaufland din România.",
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
      image: "https://tse1.mm.bing.net/th/id/OIP.RG0cX6OyjfJtwyiHi0rlkQHaHa?pid=Api&P=0&h=220",
      category: "GenTech",
      inStock: true,
      stockCount: 40,
      physical: true

    },
    {
      id: "6",
      name: "Rucsac GenTech",
      description: "Rucsac de drumeție cu logo GT",
      fullDescription: "Spațios, rezistent și confortabil, ideal pentru deplasări zilnice sau excursii. ",
      price: 400,
      image: "https://s13emagst.akamaized.net/products/55585/55584823/images/res_e4d470e3f606a5cfd9c79bb7f3ff46d3.jpg?width=720&height=720&hash=4C48E024D87E821DEC183E79555B4F5F",
      category: "GenTech",
      inStock: true,
      stockCount: 5,
      physical: true

    },
    {
      id: "60",
      name: "Philips Smart LED Strip",
      description: "Bandă LED inteligentă Philips.",
      fullDescription: "Iluminare personalizabilă, controlabilă prin aplicație sau asistent vocal, ideală pentru decor modern.",
      price: 4000,
      image: "https://tse1.mm.bing.net/th/id/OIP.r55RCnAcyoDb2nRztD7-QgHaGw?pid=Api&P=0&h=220",
      category: "Comori",
      inStock: true,
      stockCount: 5,

    },
    {
      id: "61",
      name: "Philips Headphones",
      description: "Casti Philips.",
      fullDescription: "Super comode, cu sunet clar și bass plăcut — perfecte pentru muzică, apeluri sau relaxare. Le pui pe urechi și uiți de lume!",
      price: 4000,
      image: "https://lcdn.altex.ro/media/catalog/product/C/A/CASTAH4205BL.jpg",
      category: "Comori",
      inStock: true,
      stockCount: 2,
      physical: true

    },
     {
      id: "62",
      name: "JBL Speaker",
      description: "Boxa portabila.",
      fullDescription: "JBL Charge - boxă portabilă cu sunet puternic și bass care se simte! Rezistentă la apă, cu autonomie generoasă și funcție de powerbank, e gata de petrecere oriunde ai merge.",
      price: 4000,
      image: "https://tse4.mm.bing.net/th/id/OIP.qJ-RoTTtEDHizOwiJQVImwHaE1?pid=Api&P=0&h=220",
      category: "Comori",
      inStock: true,
      stockCount: 1,
      physical: true
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

export const mockRemoveFromCart = async (rewardId) => {
    await mockStorage.networkDelay();
    
    const itemIndex = mockStorage.cart.items.findIndex(item => item.rewardId === rewardId);
    
    if (itemIndex === -1) {
        return {
            success: false,
            message: "Produsul nu a fost găsit în coș",
            cart: { ...mockStorage.cart }
        };
    }
    
    mockStorage.cart.items.splice(itemIndex, 1);
    mockStorage.cart.totalPoints = mockStorage.cart.items.reduce(
        (total, item) => total + (item.price * item.quantity), 0
    );
    
    return {
        success: true,
        message: "Produs eliminat din coș",
        cart: { 
            items: [...mockStorage.cart.items],
            totalPoints: mockStorage.cart.totalPoints 
        }
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