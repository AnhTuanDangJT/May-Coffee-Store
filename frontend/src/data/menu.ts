export type MenuCategoryId =
  | "coffee"
  | "milk-tea"
  | "fruit-tea"
  | "shake-yogurt"
  | "new-drinks"
  | "best-sellers"
  | "toppings"
  | "fresh-juice"
  | "ice-blended";

export type MenuCategory = {
  id: MenuCategoryId;
  label_vi: string;
  label_en: string;
  accentFrom: string;
  accentTo: string;
};

export type MenuItem = {
  id: string;
  name_vi: string;
  name_en: string;
  price_vnd: number;
  shortDesc_vi: string;
  shortDesc_en: string;
  category: MenuCategoryId;
  image?: string;
  isBestSeller?: boolean;
  isNew?: boolean;
};

export const MENU_CATEGORIES: MenuCategory[] = [
  {
    id: "coffee",
    label_vi: "Cà phê",
    label_en: "Coffee",
    accentFrom: "from-[#FBEED7]", // Cream
    accentTo: "to-[#D9C19D]",     // Soft Beige
  },
  {
    id: "milk-tea",
    label_vi: "Trà sữa",
    label_en: "Milk Tea",
    accentFrom: "from-[#FBEED7]", // Cream
    accentTo: "to-[#F4E6D4]",     // Pale Mocha
  },
  {
    id: "fruit-tea",
    label_vi: "Trà trái cây",
    label_en: "Fruit Tea",
    accentFrom: "from-[#FBEED7]", // Cream
    accentTo: "to-[#FBFAF0]",     // Ivory
  },
  {
    id: "shake-yogurt",
    label_vi: "Sữa chua lắc",
    label_en: "Shake Yogurt",
    accentFrom: "from-[#FDFCF5]", // Vanilla Cream
    accentTo: "to-[#F4EBD4]",     // Custard
  },
  {
    id: "new-drinks",
    label_vi: "Món mới",
    label_en: "New Drinks",
    accentFrom: "from-[#F9F3E5]", // Warm Sand
    accentTo: "to-[#FBEED7]",
  },
  {
    id: "best-sellers",
    label_vi: "Best seller",
    label_en: "Best sellers",
    accentFrom: "from-[#FBEED7]", // Light Caramel base
    accentTo: "to-[#B7966B]/30",  // Muted Latte shift
  },
  {
    id: "toppings",
    label_vi: "Topping",
    label_en: "Toppings",
    accentFrom: "from-[#FBFAF0]", // Neutral Ivory
    accentTo: "to-[#F4E6D4]",
  },
  {
    id: "fresh-juice",
    label_vi: "Nước ép",
    label_en: "Fresh juice",
    accentFrom: "from-[#FFF9F2]", // Lightest Peach
    accentTo: "to-[#FBEED7]",
  },
  {
    id: "ice-blended",
    label_vi: "Đá xay",
    label_en: "Ice blended",
    accentFrom: "from-[#F4E6D4]", // Pale Mocha
    accentTo: "to-[#FDFCF5]",
  },
];

export const MENU_ITEMS: MenuItem[] = [
  // Coffee
  {
    id: "coffee-black",
    name_vi: "Cà phê đen đá / nóng",
    name_en: "Black Coffee (Hot / Iced)",
    price_vnd: 25000,
    shortDesc_vi: "Cà phê pha máy, đậm thơm và tỉnh táo tức thì.",
    shortDesc_en: "Machine-brewed coffee served hot or iced for a bold kick.",
    category: "coffee",
  },
  {
    id: "coffee-milk",
    name_vi: "Cà phê sữa đá / nóng",
    name_en: "Milk Coffee (Hot / Iced)",
    price_vnd: 28000,
    shortDesc_vi: "Cà phê pha máy đậm quyện sữa đặc béo nhẹ, hậu vị caramel.",
    shortDesc_en: "Machine-brewed coffee with silky condensed milk and caramel notes.",
    category: "coffee",
  },
  {
    id: "coffee-bac-siu",
    name_vi: "Bạc sỉu đá / nóng",
    name_en: "Bạc Sỉu",
    price_vnd: 30000,
    shortDesc_vi: "Sữa tươi nhiều hơn cà phê, thơm nhẹ và dễ uống cả ngày.",
    shortDesc_en: "Creamy milk-forward coffee inspired by Saigon mornings.",
    category: "coffee",
    image: "/media/signature-coffee.png",
    isBestSeller: true,
  },
  {
    id: "coffee-almond-macchiato",
    name_vi: "Cà phê hạnh nhân Macchiato",
    name_en: "Almond Macchiato Coffee",
    price_vnd: 37000,
    shortDesc_vi: "Lớp bọt macchiato béo nhẹ, hạnh nhân syrup và espresso ngọt hậu.",
    shortDesc_en: "Silky macchiato cap with almond syrup over espresso.",
    category: "coffee",
  },
  {
    id: "coffee-salt",
    name_vi: "Cà phê muối",
    name_en: "Salted Coffee",
    price_vnd: 35000,
    shortDesc_vi: "Kem muối mặn ngọt cân bằng vị đắng cà phê rang đậm.",
    shortDesc_en: "Salted cream floats over dark roast for a sweet-salty finish.",
    category: "coffee",
  },
  {
    id: "coffee-fresh-milk",
    name_vi: "Sữa tươi cà phê",
    name_en: "Fresh Milk Coffee",
    price_vnd: 35000,
    shortDesc_vi: "Sữa tươi lạnh và espresso nóng hòa quyện mượt mà.",
    shortDesc_en: "Chilled fresh milk blended with hot espresso for marble layers.",
    category: "coffee",
  },
  {
    id: "coffee-cocoa",
    name_vi: "Cacao sữa",
    name_en: "Cocoa Milk",
    price_vnd: 35000,
    shortDesc_vi: "Bột cacao nguyên chất và sữa tươi tạo vị ngọt êm.",
    shortDesc_en: "Rich cocoa whisked with fresh milk for a mellow treat.",
    category: "coffee",
  },

  // Milk tea
  {
    id: "milk-may",
    name_vi: "Trà sữa May",
    name_en: "May Milk Tea",
    price_vnd: 27000,
    shortDesc_vi: "Công thức đặc trưng, vị trà đậm và sữa thơm nhẹ béo.",
    shortDesc_en: "House milk tea with balanced tannin and creamy sweetness.",
    category: "milk-tea",
    isBestSeller: true,
  },
  {
    id: "milk-oolong",
    name_vi: "Trà sữa ô long",
    name_en: "Oolong Milk Tea",
    price_vnd: 29000,
    shortDesc_vi: "Ô long ủ chuẩn, hương hoa nhẹ và hậu vị thanh.",
    shortDesc_en: "Slow-steeped oolong layered with fresh milk.",
    category: "milk-tea",
  },
  {
    id: "milk-jasmine",
    name_vi: "Trà sữa lài",
    name_en: "Jasmine Milk Tea",
    price_vnd: 27000,
    shortDesc_vi: "Trà lài thơm thanh, kết hợp sữa tươi dịu nhẹ.",
    shortDesc_en: "Fragrant jasmine tea mellowed with silky milk.",
    category: "milk-tea",
  },
  {
    id: "milk-matcha",
    name_vi: "Trà sữa matcha",
    name_en: "Matcha Milk Tea",
    price_vnd: 32000,
    shortDesc_vi: "Matcha xay mịn và sữa tươi thanh béo.",
    shortDesc_en: "Fine matcha folded into creamy milk tea.",
    category: "milk-tea",
  },
  {
    id: "milk-taro",
    name_vi: "Trà sữa khoai môn",
    name_en: "Taro Milk Tea",
    price_vnd: 32000,
    shortDesc_vi: "Khoai môn xay nhuyễn, thơm bùi và dịu vị sữa.",
    shortDesc_en: "Velvety taro puree blended with sweet milk tea.",
    category: "milk-tea",
  },
  {
    id: "milk-lotus",
    name_vi: "Trà sữa sen",
    name_en: "Lotus Milk Tea",
    price_vnd: 35000,
    shortDesc_vi: "Hạt sen nghiền mịn, vị ngọt thanh và hương dịu.",
    shortDesc_en: "Lotus-infused milk tea with gentle floral sweetness.",
    category: "milk-tea",
  },
  {
    id: "milk-boba",
    name_vi: "Sữa tươi trân châu đường đen",
    name_en: "Brown Sugar Pearl Fresh Milk",
    price_vnd: 35000,
    shortDesc_vi: "Trân châu đường đen nấu mới mỗi ngày, sữa tươi mát lạnh.",
    shortDesc_en: "Daily-cooked brown sugar pearls poured over fresh milk.",
    category: "milk-tea",
  },

  // Fruit tea
  {
    id: "fruit-lotus",
    name_vi: "Trà sen vàng",
    name_en: "Golden Lotus Tea",
    price_vnd: 38000,
    shortDesc_vi: "Trà vàng, hạt sen và mật ong thơm nhẹ.",
    shortDesc_en: "Lotus seeds with golden tea and warm honey.",
    category: "fruit-tea",
  },
  {
    id: "fruit-citrus",
    name_vi: "Trà cam quýt",
    name_en: "Citrus Tea",
    price_vnd: 35000,
    shortDesc_vi: "Cam - quýt tươi và lá trà xanh dịu mát.",
    shortDesc_en: "Orange & mandarin segments with refreshing tea base.",
    category: "fruit-tea",
  },
  {
    id: "fruit-peach-orange",
    name_vi: "Trà đào cam sả",
    name_en: "Peach Orange Lemongrass Tea",
    price_vnd: 35000,
    shortDesc_vi: "Đào vàng, vỏ cam và sả non tạo vị thơm sảng khoái.",
    shortDesc_en: "Peach nectar, orange peel, and lemongrass uplift.",
    category: "fruit-tea",
  },
  {
    id: "fruit-lychee",
    name_vi: "Trà vải",
    name_en: "Lychee Tea",
    price_vnd: 35000,
    shortDesc_vi: "Vải tươi và trà đen hoa quả, dịu ngọt.",
    shortDesc_en: "Juicy lychee over chilled black tea.",
    category: "fruit-tea",
  },
  {
    id: "fruit-passion",
    name_vi: "Trà chanh dây",
    name_en: "Passion Fruit Tea",
    price_vnd: 35000,
    shortDesc_vi: "Chanh dây tươi, vị chua ngọt cân bằng.",
    shortDesc_en: "Tart passion fruit shaken with golden tea.",
    category: "fruit-tea",
  },
  {
    id: "fruit-jasmine-pineapple",
    name_vi: "Trà lài đác thơm",
    name_en: "Jasmine Tea with Nata de Coco & Pineapple",
    price_vnd: 37000,
    shortDesc_vi: "Trà lài, dừa đác và thơm Đà Lạt giòn mát.",
    shortDesc_en: "Jasmine tea, nata de coco, and juicy pineapple.",
    category: "fruit-tea",
  },
  {
    id: "fruit-mango",
    name_vi: "Trà xoài",
    name_en: "Mango Tea",
    price_vnd: 37000,
    shortDesc_vi: "Xoài chín xay nhẹ với trà xanh mát lành.",
    shortDesc_en: "Bright mango puree folded into cool green tea.",
    category: "fruit-tea",
  },
  {
    id: "fruit-soursop",
    name_vi: "Trà mãng cầu",
    name_en: "Soursop Tea",
    price_vnd: 37000,
    shortDesc_vi: "Mãng cầu tươi và trà nhài tạo vị ngọt thơm.",
    shortDesc_en: "Creamy soursop meets elegant jasmine tea.",
    category: "fruit-tea",
  },

  // Shake Yogurt
  {
    id: "yogurt-classic",
    name_vi: "Sữa chua lắc",
    name_en: "Shaken Yogurt",
    price_vnd: 32000,
    shortDesc_vi: "Sữa chua đánh bông và đá lạnh, mát nhẹ cả ngày.",
    shortDesc_en: "Fluffy yogurt shaken with ice for a refreshing sip.",
    category: "shake-yogurt",
  },
  {
    id: "yogurt-strawberry",
    name_vi: "Sữa chua lắc dâu",
    name_en: "Strawberry Yogurt Shake",
    price_vnd: 37000,
    shortDesc_vi: "Mứt dâu nhà làm và yogurt béo nhẹ.",
    shortDesc_en: "House strawberry compote swirled through yogurt.",
    category: "shake-yogurt",
  },
  {
    id: "yogurt-kiwi",
    name_vi: "Sữa chua lắc kiwi",
    name_en: "Kiwi Yogurt Shake",
    price_vnd: 37000,
    shortDesc_vi: "Kiwi chua ngọt cân bằng độ béo của sữa chua.",
    shortDesc_en: "Kiwi pulp brightens the creamy yogurt base.",
    category: "shake-yogurt",
  },
  {
    id: "yogurt-blueberry",
    name_vi: "Sữa chua lắc việt quất",
    name_en: "Blueberry Yogurt Shake",
    price_vnd: 37000,
    shortDesc_vi: "Việt quất Đà Lạt, màu tím tự nhiên đẹp mắt.",
    shortDesc_en: "Dalat blueberries lend a jewel tone to yogurt.",
    category: "shake-yogurt",
  },
  {
    id: "yogurt-passion",
    name_vi: "Sữa chua lắc chanh dây",
    name_en: "Passion Fruit Yogurt Shake",
    price_vnd: 37000,
    shortDesc_vi: "Chanh dây tươi tạo vị chua ngọt đầy năng lượng.",
    shortDesc_en: "Tart passion fruit wakes up the creamy shake.",
    category: "shake-yogurt",
  },
  {
    id: "yogurt-melon",
    name_vi: "Sữa chua lắc dưa lưới",
    name_en: "Honeydew Yogurt Shake",
    price_vnd: 37000,
    shortDesc_vi: "Dưa lưới giòn ngọt, hương thơm nhẹ nhàng.",
    shortDesc_en: "Honeydew chunks folded into chilled yogurt.",
    category: "shake-yogurt",
  },
  {
    id: "yogurt-peach",
    name_vi: "Sữa chua lắc đào",
    name_en: "Peach Yogurt Shake",
    price_vnd: 37000,
    shortDesc_vi: "Đào vàng sên nhẹ và yogurt béo nhẹ.",
    shortDesc_en: "Golden peach syrup with airy yogurt.",
    category: "shake-yogurt",
  },
  {
    id: "yogurt-mango",
    name_vi: "Sữa chua lắc xoài",
    name_en: "Mango Yogurt Shake",
    price_vnd: 37000,
    shortDesc_vi: "Xoài tươi xay nhuyễn, vị nhiệt đới ngọt dịu.",
    shortDesc_en: "Tropical mango swirled into frothy yogurt.",
    category: "shake-yogurt",
  },

  // New drinks
  {
    id: "new-matcha-mango",
    name_vi: "Matcha latte xoài",
    name_en: "Mango Matcha Latte",
    price_vnd: 38000,
    shortDesc_vi: "Matcha và xoài chín tạo tầng màu xanh - vàng mướt mắt.",
    shortDesc_en: "Layered matcha over mango puree for a sunny latte.",
    category: "new-drinks",
    isNew: true,
  },
  {
    id: "new-mango-tea",
    name_vi: "Trà xoài phiên bản 2026",
    name_en: "Mango Tea Limited",
    price_vnd: 37000,
    shortDesc_vi: "Bản cập nhật với syrup hoa lài và topping xoài hạt lựu.",
    shortDesc_en: "Limited mango tea with jasmine syrup & diced fruit.",
    category: "new-drinks",
  },
  {
    id: "new-soursop-tea",
    name_vi: "Trà mãng cầu phiên bản mới",
    name_en: "Soursop Tea Refresh",
    price_vnd: 37000,
    shortDesc_vi: "Mãng cầu trộn dừa non và lá bạc hà mát lạnh.",
    shortDesc_en: "Creamy soursop meets coconut bits and mint.",
    category: "new-drinks",
  },
  {
    id: "new-strawberry-snow",
    name_vi: "Dâu tuyết xay",
    name_en: "Strawberry Snow Smoothie",
    price_vnd: 42000,
    shortDesc_vi: "Dâu tươi xay tuyết với kem sữa vani mịn màng.",
    shortDesc_en: "Snowy strawberry smoothie crowned with vanilla cream.",
    category: "new-drinks",
  },
  {
    id: "new-caramel-latte",
    name_vi: "Latte caramel",
    name_en: "Caramel Latte",
    price_vnd: 35000,
    shortDesc_vi: "Espresso blend cùng caramel cháy và sữa tươi.",
    shortDesc_en: "Espresso latte with torched caramel swirl.",
    category: "new-drinks",
  },
  {
    id: "new-cheese-milk-tea",
    name_vi: "Trà sữa phô mai",
    name_en: "Cheese Milk Tea",
    price_vnd: 32000,
    shortDesc_vi: "Kem cheese mặn ngọt phủ trên trà đen thanh.",
    shortDesc_en: "Black tea topped with soft salted cheese foam.",
    category: "new-drinks",
  },
  {
    id: "new-lotus-milk-tea",
    name_vi: "Trà sữa sen đặc biệt",
    name_en: "Lotus Milk Tea Deluxe",
    price_vnd: 35000,
    shortDesc_vi: "Thêm hạt sen rang bơ và thạch hoa cam.",
    shortDesc_en: "Lotus milk tea upgraded with roasted seeds & jelly.",
    category: "new-drinks",
  },

  // Best sellers
  {
    id: "best-may-milk-tea",
    name_vi: "Best seller • Trà sữa May",
    name_en: "Best Seller • May Milk Tea",
    price_vnd: 27000,
    shortDesc_vi: "Khách quen chọn mỗi ngày vì vị trà nịnh miệng.",
    shortDesc_en: "Daily favorite for its balanced, cozy sweetness.",
    category: "best-sellers",
  },
  {
    id: "best-citrus-tea",
    name_vi: "Best seller • Trà cam quýt",
    name_en: "Best Seller • Citrus Tea",
    price_vnd: 35000,
    shortDesc_vi: "Vị cam quýt tươi sáng, uống lạnh cực sảng khoái.",
    shortDesc_en: "Sunny orange-mandarin tea served ice-cold.",
    category: "best-sellers",
  },
  {
    id: "best-peach-orange",
    name_vi: "Best seller • Đào cam sả",
    name_en: "Best Seller • Peach Orange Lemongrass",
    price_vnd: 35000,
    shortDesc_vi: "Sả non thơm dịu giúp món đào cam nổi bật.",
    shortDesc_en: "Aromatic lemongrass lifts peach-orange sweetness.",
    category: "best-sellers",
  },
  {
    id: "best-jasmine-pineapple",
    name_vi: "Best seller • Trà lài đác thơm",
    name_en: "Best Seller • Jasmine Pineapple",
    price_vnd: 37000,
    shortDesc_vi: "Vị giòn của đác kết hợp thơm vàng và trà lài.",
    shortDesc_en: "Crunchy nata de coco with jasmine & pineapple.",
    category: "best-sellers",
  },
  {
    id: "best-matcha-latte",
    name_vi: "Best seller • Matcha latte",
    name_en: "Best Seller • Matcha Latte",
    price_vnd: 37000,
    shortDesc_vi: "Matcha béo nhẹ, được yêu thích quanh năm.",
    shortDesc_en: "Creamy matcha latte loved in every season.",
    category: "best-sellers",
  },

  // Toppings
  {
    id: "topping-pudding",
    name_vi: "Pudding",
    name_en: "Pudding",
    price_vnd: 7000,
    shortDesc_vi: "Pudding trứng nấu mỗi sáng, mềm và thơm vanilla.",
    shortDesc_en: "House egg pudding with vanilla aroma.",
    category: "toppings",
  },
  {
    id: "topping-black-pearls",
    name_vi: "Trân châu đen",
    name_en: "Black Tapioca Pearls",
    price_vnd: 5000,
    shortDesc_vi: "Trân châu đen dai mềm, vị đường nâu.",
    shortDesc_en: "Chewy brown-sugar black pearls.",
    category: "toppings",
  },
  {
    id: "topping-white-pearls",
    name_vi: "Trân châu trắng",
    name_en: "White Tapioca Pearls",
    price_vnd: 5000,
    shortDesc_vi: "Trân châu trắng thanh nhẹ, ăn vui miệng.",
    shortDesc_en: "Light, bouncy white pearls.",
    category: "toppings",
  },
  {
    id: "topping-water-chestnut",
    name_vi: "Trân châu củ năng",
    name_en: "Water Chestnut Pearls",
    price_vnd: 8000,
    shortDesc_vi: "Miếng củ năng giòn giòn kết hợp syrup thơm.",
    shortDesc_en: "Crunchy water chestnut pearls with syrup glaze.",
    category: "toppings",
  },
  {
    id: "topping-full",
    name_vi: "Full topping",
    name_en: "Full Toppings",
    price_vnd: 10000,
    shortDesc_vi: "Combo trân châu + pudding + thạch cho ly đầy đặn.",
    shortDesc_en: "All toppings in one joyful scoop.",
    category: "toppings",
  },
  {
    id: "topping-caramel",
    name_vi: "Trân châu caramel",
    name_en: "Caramel Tapioca Pearls",
    price_vnd: 5000,
    shortDesc_vi: "Áo caramel cháy nhẹ, thơm mùi bơ nâu.",
    shortDesc_en: "Tapioca pearls coated in toasty caramel.",
    category: "toppings",
  },

  // Fresh juice
  {
    id: "juice-watermelon",
    name_vi: "Nước ép dưa hấu",
    name_en: "Watermelon Juice",
    price_vnd: 32000,
    shortDesc_vi: "Dưa hấu ép lạnh giữ trọn vị ngọt mát.",
    shortDesc_en: "Cold-pressed watermelon for instant refreshment.",
    category: "fresh-juice",
  },
  {
    id: "juice-orange",
    name_vi: "Nước ép cam",
    name_en: "Orange Juice",
    price_vnd: 32000,
    shortDesc_vi: "Cam tươi vắt tại chỗ, giàu vitamin C.",
    shortDesc_en: "Freshly squeezed oranges, no added sugar.",
    category: "fresh-juice",
  },
  {
    id: "juice-orange-plum",
    name_vi: "Cam xí muội",
    name_en: "Salted Plum Orange Juice",
    price_vnd: 35000,
    shortDesc_vi: "Cam ngọt kết hợp xí muội mặn mặn lạ miệng.",
    shortDesc_en: "Sweet orange shaken with salted plum for depth.",
    category: "fresh-juice",
  },
  {
    id: "juice-guava",
    name_vi: "Nước ép ổi",
    name_en: "Guava Juice",
    price_vnd: 35000,
    shortDesc_vi: "Ổi đỏ ép lạnh, thơm nhẹ và tốt cho sức khỏe.",
    shortDesc_en: "Ruby guava juice with natural sweetness.",
    category: "fresh-juice",
  },

  // Ice blended
  {
    id: "blend-blueberry-cheese",
    name_vi: "Phô mai việt quất đá xay",
    name_en: "Blueberry Cheese Smoothie",
    price_vnd: 42000,
    shortDesc_vi: "Việt quất và kem phô mai tạo lớp marble bắt mắt.",
    shortDesc_en: "Blueberry swirl with cheesecake cream.",
    category: "ice-blended",
  },
  {
    id: "blend-matcha",
    name_vi: "Matcha đá xay",
    name_en: "Matcha Smoothie",
    price_vnd: 42000,
    shortDesc_vi: "Matcha mịn và sữa tươi lạnh đánh bông.",
    shortDesc_en: "Frosty matcha with whipped milk.",
    category: "ice-blended",
  },
  {
    id: "blend-coffee",
    name_vi: "Cà phê đá xay",
    name_en: "Coffee Smoothie",
    price_vnd: 42000,
    shortDesc_vi: "Espresso và kem vani hòa quyện trên nền tuyết.",
    shortDesc_en: "Espresso frappe finished with vanilla cream.",
    category: "ice-blended",
  },
  {
    id: "blend-oreo",
    name_vi: "Cookie Oreo đá xay",
    name_en: "Oreo Cookie Smoothie",
    price_vnd: 42000,
    shortDesc_vi: "Cookie giòn và kem béo, ai cũng mê.",
    shortDesc_en: "Crushed Oreo cookies in a creamy shake.",
    category: "ice-blended",
  },
  {
    id: "blend-strawberry-snow",
    name_vi: "Dâu tuyết xay signature",
    name_en: "Strawberry Snow Smoothie",
    price_vnd: 42000,
    shortDesc_vi: "Bản đá xay của dòng dâu tuyết mùa hè.",
    shortDesc_en: "Signature snow smoothie with strawberry ribbon.",
    category: "ice-blended",
  },
];

