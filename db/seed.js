// seed.js - Rich realistic catalog data for Apex Product App
const seedProducts = [
  {
    id: 1,
    name: "AeroBeats Pro Studio Headphones",
    sku: "AUD-AB-001",
    category: "Audio & Acoustics",
    brand: "AeroSound",
    price: 349.99,
    compare_at_price: 399.99,
    stock: 24,
    rating: 4.9,
    reviews_count: 128,
    description: "Engineered for uncompromising audiophiles. Features custom 45mm neodymium drivers, active hybrid noise cancellation (ANC), 40-hour battery life, and ultra-plush memory foam cushions for all-day mastering and listening sessions.",
    image_url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
    secondary_images: JSON.stringify([
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80"
    ]),
    features: JSON.stringify([
      "Custom 45mm bio-cellulose drivers",
      "Hybrid Active Noise Cancellation with Transparency mode",
      "Up to 40 hours battery life with USB-C fast charging",
      "Multipoint Bluetooth 5.3 + Lossless USB-C Audio",
      "Precision machined aluminum and memory foam build"
    ]),
    tags: JSON.stringify(["Audio", "ANC", "Wireless", "Bestseller", "Premium"]),
    created_at: new Date(Date.now() - 86400000 * 15).toISOString()
  },
  {
    id: 2,
    name: "Chronos Apex Titanium Smartwatch",
    sku: "WR-CR-002",
    category: "Wearables & Smart",
    brand: "Chronos Tech",
    price: 499.00,
    compare_at_price: 549.00,
    stock: 15,
    rating: 4.8,
    reviews_count: 94,
    description: "Crafted from aerospace-grade Grade 5 titanium with a sapphire crystal AMOLED touchscreen. Packed with dual-band GPS, continuous ECG and SpO2 health tracking, and 100m water resistance for backcountry exploration or executive boardrooms.",
    image_url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80",
    secondary_images: JSON.stringify([
      "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=800&q=80"
    ]),
    features: JSON.stringify([
      "Aerospace Grade 5 Titanium unibody casing",
      "Sapphire crystal glass 1.4-inch AMOLED display",
      "7-day active battery life with solar reserve",
      "Advanced ECG, heart rate variability, and sleep architecture analysis",
      "10 ATM water resistance (100 meters)"
    ]),
    tags: JSON.stringify(["Wearable", "Titanium", "Fitness", "GPS", "Bestseller"]),
    created_at: new Date(Date.now() - 86400000 * 12).toISOString()
  },
  {
    id: 3,
    name: "Apex ErgoDesk Walnut Pro",
    sku: "WRK-DK-003",
    category: "Workspace Essentials",
    brand: "Apex Design",
    price: 789.00,
    compare_at_price: 899.00,
    stock: 8,
    rating: 4.9,
    reviews_count: 67,
    description: "Solid American Black Walnut standing desk with dual whisper-quiet German dual-motor actuators. Features programmable 4-height memory presets, integrated wire management trough, and an anti-collision gyroscope.",
    image_url: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=800&q=80",
    secondary_images: JSON.stringify([
      "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80"
    ]),
    features: JSON.stringify([
      "100% sustainably sourced Solid Black Walnut tabletop (60x30 in)",
      "Dual German whisper motors (<45dB sound level)",
      "Integrated 6-outlet power hub and magnetic cable spine",
      "Weight capacity: 350 lbs (158 kg)",
      "10-year comprehensive structural warranty"
    ]),
    tags: JSON.stringify(["Workspace", "Ergonomics", "Wood", "Furniture", "Desk"]),
    created_at: new Date(Date.now() - 86400000 * 20).toISOString()
  },
  {
    id: 4,
    name: "Vortex Custom 75% Mechanical Keyboard",
    sku: "TEC-KB-004",
    category: "Tech & Computing",
    brand: "Vortex Labs",
    price: 189.50,
    compare_at_price: 219.00,
    stock: 32,
    rating: 4.7,
    reviews_count: 152,
    description: "Gasket-mounted mechanical keyboard built with CNC anodized aluminum, hot-swappable pre-lubed linear switches, and PBT double-shot keycaps. Tri-mode connectivity (2.4GHz wireless, Bluetooth 5.1, and USB-C).",
    image_url: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80",
    secondary_images: JSON.stringify([
      "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=800&q=80"
    ]),
    features: JSON.stringify([
      "Gasket mounted architecture with sound-dampening PORON foam",
      "Hot-swappable 5-pin PCB supports all MX-style switches",
      "CNC milled 6063 anodized aluminum chassis",
      "Per-key south-facing RGB lighting with QMK/VIA programmability",
      "4000mAh battery for up to 200 hours wireless typing"
    ]),
    tags: JSON.stringify(["Keyboard", "Mechanical", "Gaming", "Wireless", "Tech"]),
    created_at: new Date(Date.now() - 86400000 * 8).toISOString()
  },
  {
    id: 5,
    name: "Lumina 4K UHD 32-inch Studio Display",
    sku: "TEC-MN-005",
    category: "Tech & Computing",
    brand: "Lumina Vision",
    price: 899.00,
    compare_at_price: 999.00,
    stock: 6,
    rating: 4.8,
    reviews_count: 42,
    description: "Reference-grade 32-inch 4K IPS panel engineered for visual artists, developers, and filmmakers. Boasts 99% DCI-P3 color gamut, hardware calibration, 96W USB-C Thunderbolt 4 power delivery, and an anti-reflective nano-texture finish.",
    image_url: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80",
    secondary_images: JSON.stringify([
      "https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&w=800&q=80"
    ]),
    features: JSON.stringify([
      "3840 x 2160 IPS panel with 1200:1 contrast ratio",
      "99% DCI-P3 and 100% sRGB factory calibrated (Delta E < 1.5)",
      "Thunderbolt 4 single-cable connectivity with 96W power delivery",
      "Nano-etched anti-glare glass coating",
      "Fully articulating height, tilt, swivel, and pivot stand"
    ]),
    tags: JSON.stringify(["Monitor", "Display", "4K", "Thunderbolt", "Tech"]),
    created_at: new Date(Date.now() - 86400000 * 25).toISOString()
  },
  {
    id: 6,
    name: "Nomad Canvas & Full-Grain Leather Backpack",
    sku: "LIF-BP-006",
    category: "Lifestyle & Apparel",
    brand: "Nomad Goods",
    price: 210.00,
    compare_at_price: 250.00,
    stock: 19,
    rating: 4.9,
    reviews_count: 88,
    description: "Weather-resistant 18oz waxed canvas paired with vegetable-tanned Italian leather accents. Features a suspended padded compartment for up to 16-inch laptops, quick-access passport pocket, and YKK Aquaguard zippers.",
    image_url: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80",
    secondary_images: JSON.stringify([
      "https://images.unsplash.com/photo-1546938576-6e6a64f317cc?auto=format&fit=crop&w=800&q=80"
    ]),
    features: JSON.stringify([
      "18oz Martexin Original Waxed Cotton Canvas",
      "Full-grain vegetable-tanned Tuscan leather trims",
      "Dedicated suspended 16\" MacBook Pro sleeve with microfiber lining",
      "Luggage pass-through strap and concealed security pocket",
      "Water-repellent YKK zippers and solid brass hardware"
    ]),
    tags: JSON.stringify(["Bag", "Backpack", "Travel", "Leather", "Waterproof"]),
    created_at: new Date(Date.now() - 86400000 * 5).toISOString()
  },
  {
    id: 7,
    name: "Aura Smart Biometric Ring Gen 3",
    sku: "WR-RG-007",
    category: "Wearables & Smart",
    brand: "Aura Health",
    price: 299.00,
    compare_at_price: 329.00,
    stock: 22,
    rating: 4.6,
    reviews_count: 110,
    description: "Featherlight titanium health tracker worn comfortably on your finger. Precision infrared photodiode sensors measure body temperature trends, HRV, sleep stage efficiency, and readiness score without any monthly subscription fees.",
    image_url: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80",
    secondary_images: JSON.stringify([
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800&q=80"
    ]),
    features: JSON.stringify([
      "Ultralight 4g titanium construction with PVD coating",
      "Medical-grade optical PPG, skin temperature, and 3D accelerometer",
      "6-day battery endurance with rapid magnetic induction charger",
      "Water resistant to 100m (swim and dive friendly)",
      "Zero subscription fees for all advanced metrics"
    ]),
    tags: JSON.stringify(["Wearable", "Ring", "Health", "Sleep", "Fitness"]),
    created_at: new Date(Date.now() - 86400000 * 18).toISOString()
  },
  {
    id: 8,
    name: "Hi-Fi Heritage Belt-Drive Turntable",
    sku: "AUD-TT-008",
    category: "Audio & Acoustics",
    brand: "Heritage Audio",
    price: 449.00,
    compare_at_price: 499.00,
    stock: 7,
    rating: 4.8,
    reviews_count: 36,
    description: "An audiophile-grade vinyl record player featuring a solid resonance-damped MDF plinth clad in real walnut veneer. Equipped with an Ortofon 2M Red cartridge, carbon-fiber tonearm, and switchable phono preamp.",
    image_url: "https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=800&q=80",
    secondary_images: JSON.stringify([
      "https://images.unsplash.com/photo-1603048588665-791ca8aea617?auto=format&fit=crop&w=800&q=80"
    ]),
    features: JSON.stringify([
      "Factory aligned Ortofon 2M Red elliptical diamond cartridge",
      "Precision 8.6\" one-piece carbon fiber tonearm",
      "Heavyweight precision aluminum platter with silicone dampening",
      "Built-in ultra-low-noise phono pre-amplifier with gold plated RCA",
      "Real American walnut wood veneer finish"
    ]),
    tags: JSON.stringify(["Audio", "Vinyl", "Turntable", "Hi-Fi", "Vintage"]),
    created_at: new Date(Date.now() - 86400000 * 30).toISOString()
  },
  {
    id: 9,
    name: "ErgoPro Kinetic Mesh Task Chair",
    sku: "WRK-CH-009",
    category: "Workspace Essentials",
    brand: "ErgoPro",
    price: 580.00,
    compare_at_price: 650.00,
    stock: 11,
    rating: 4.9,
    reviews_count: 73,
    description: "Active spinal support system featuring breathable elastomeric mesh, 4D multi-positional armrests, synchronized tilt lock mechanism, and dynamic adaptive lumbar cushion that tracks spinal curvature.",
    image_url: "https://images.unsplash.com/photo-1580481077198-c847ad43617f?auto=format&fit=crop&w=800&q=80",
    secondary_images: JSON.stringify([
      "https://images.unsplash.com/photo-1505797149-43b0069ec26b?auto=format&fit=crop&w=800&q=80"
    ]),
    features: JSON.stringify([
      "Automated weight-sensing synchro-tilt mechanism",
      "Dynamic response lumbar support cushion",
      "4D armrests adjustable in height, width, depth, and angle",
      "Heavy-duty polished aluminum 5-wheel wheelbase",
      "Tested and certified to ANSI/BIFMA X5.1 standards"
    ]),
    tags: JSON.stringify(["Chair", "Ergonomics", "Office", "Workspace"]),
    created_at: new Date(Date.now() - 86400000 * 14).toISOString()
  },
  {
    id: 10,
    name: "Zenith Thermal Titanium Insulated Flask",
    sku: "LIF-FL-010",
    category: "Lifestyle & Apparel",
    brand: "Zenith Outdoors",
    price: 68.00,
    compare_at_price: 78.00,
    stock: 45,
    rating: 4.7,
    reviews_count: 140,
    description: "Double-walled pure grade 1 titanium thermos with vacuum isolation. Keeps beverages boiling hot for 18 hours or ice-cold for 36 hours without imparting metallic flavor or odor. Ultra-durable and corrosion-proof.",
    image_url: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=800&q=80",
    secondary_images: JSON.stringify([
      "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=800&q=80"
    ]),
    features: JSON.stringify([
      "100% Grade 1 biocompatible Titanium construction",
      "Double-wall vacuum insulation keeps liquids cold 36h / hot 18h",
      "Zero flavor retention, BPA-free and non-toxic",
      "Weighs only 210 grams with 750ml capacity",
      "Leak-proof titanium cap with food-grade silicone seal"
    ]),
    tags: JSON.stringify(["Titanium", "Bottle", "Travel", "Lifestyle", "Outdoor"]),
    created_at: new Date(Date.now() - 86400000 * 3).toISOString()
  },
  {
    id: 11,
    name: "MagSafe Multi-Device 3-in-1 Charging Stand",
    sku: "TEC-CH-011",
    category: "Tech & Computing",
    brand: "Lumina Vision",
    price: 119.00,
    compare_at_price: 139.00,
    stock: 28,
    rating: 4.8,
    reviews_count: 95,
    description: "Fast wireless charging dock for iPhone (15W MagSafe), Apple Watch Ultra, and AirPods Pro simultaneously. Sculpted from solid space gray aluminum with soft-touch silicone pads.",
    image_url: "https://images.unsplash.com/photo-1622445262464-84b1456045b6?auto=format&fit=crop&w=800&q=80",
    secondary_images: JSON.stringify([
      "https://images.unsplash.com/photo-1586953208448-b95a79798f07?auto=format&fit=crop&w=800&q=80"
    ]),
    features: JSON.stringify([
      "Official 15W MagSafe fast charging module",
      "Fast charge puck for smartwatches",
      "Solid zinc and aluminum base prevents tipping",
      "Foldable travel-friendly design",
      "Includes 65W GaN power adapter with braided USB-C cable"
    ]),
    tags: JSON.stringify(["Charger", "MagSafe", "Wireless", "Apple", "Accessories"]),
    created_at: new Date(Date.now() - 86400000 * 9).toISOString()
  },
  {
    id: 12,
    name: "Artisan Ceramic Pour-Over Coffee Station",
    sku: "LIF-CF-012",
    category: "Lifestyle & Apparel",
    brand: "Artisan Craft",
    price: 85.00,
    compare_at_price: 95.00,
    stock: 14,
    rating: 4.9,
    reviews_count: 51,
    description: "Handcrafted matte black ceramic dripper with spiral interior ribs for optimal water flow extraction. Includes a 600ml borosilicate glass server and a solid walnut drip tray base.",
    image_url: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80",
    secondary_images: JSON.stringify([
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80"
    ]),
    features: JSON.stringify([
      "High-density ceramic body retains consistent brew temperature",
      "600ml heat-resistant borosilicate glass carafe with measurements",
      "Solid walnut base with water-repellent protective oil seal",
      "Compatible with standard V60 02 paper & metal filters",
      "Handmade in limited seasonal batches"
    ]),
    tags: JSON.stringify(["Coffee", "Kitchen", "Ceramic", "Lifestyle", "Handmade"]),
    created_at: new Date(Date.now() - 86400000 * 22).toISOString()
  },
  {
    id: 13,
    name: "Barista Precision Smart Gooseneck Kettle",
    sku: "LIF-KT-013",
    category: "Lifestyle & Apparel",
    brand: "Artisan Craft",
    price: 155.00,
    compare_at_price: 175.00,
    stock: 3,
    rating: 4.8,
    reviews_count: 64,
    description: "Digital temperature control kettle with 1-degree Fahrenheit accuracy, LCD countdown brew stopwatch, and an elongated gooseneck spout for an exact, steady stream rate. Low stock alert!",
    image_url: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=800&q=80",
    secondary_images: JSON.stringify([
      "https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?auto=format&fit=crop&w=800&q=80"
    ]),
    features: JSON.stringify([
      "1200W rapid heating element boils 0.9L in under 3 minutes",
      "To-the-degree temperature control from 104°F to 212°F (40°C to 100°C)",
      "60-minute temperature hold mode",
      "Balanced counterbalanced handle prevents wrist fatigue",
      "Stainless steel 304 food-grade interior"
    ]),
    tags: JSON.stringify(["Coffee", "Kettle", "Smart", "Kitchen", "Low Stock"]),
    created_at: new Date(Date.now() - 86400000 * 7).toISOString()
  },
  {
    id: 14,
    name: "Optima Ambient Smart ScreenBar Light",
    sku: "WRK-LT-014",
    category: "Workspace Essentials",
    brand: "Apex Design",
    price: 129.00,
    compare_at_price: 149.00,
    stock: 0,
    rating: 4.7,
    reviews_count: 82,
    description: "Asymmetric optical monitor lamp that illuminates your desk workspace without screen glare or reflections. Controlled via a wireless desktop rotary dial for smooth brightness and color temperature tuning.",
    image_url: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80",
    secondary_images: JSON.stringify([
      "https://images.unsplash.com/photo-1517495306684-245587a58d63?auto=format&fit=crop&w=800&q=80"
    ]),
    features: JSON.stringify([
      "Patented asymmetrical optical design eliminates screen reflections",
      "Wireless 2.4GHz tactile aluminum rotary desktop controller",
      "Auto-dimming ambient light sensor dynamically adjusts brightness",
      "CRI Ra>95 natural color rendering",
      "USB-C powered directly from monitor hub or PC"
    ]),
    tags: JSON.stringify(["Lighting", "Workspace", "Desk", "Ergonomics", "Out of Stock"]),
    created_at: new Date(Date.now() - 86400000 * 28).toISOString()
  },
  {
    id: 15,
    name: "Pulse ANC True Wireless Earbuds",
    sku: "AUD-EB-015",
    category: "Audio & Acoustics",
    brand: "AeroSound",
    price: 179.99,
    compare_at_price: 199.99,
    stock: 38,
    rating: 4.6,
    reviews_count: 174,
    description: "Compact in-ear monitors with adaptive ANC up to 45dB, beamforming wind-filtering microphones, IPX5 water resistance for intense workouts, and wireless Qi charging case.",
    image_url: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80",
    secondary_images: JSON.stringify([
      "https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?auto=format&fit=crop&w=800&q=80"
    ]),
    features: JSON.stringify([
      "Smart adaptive noise cancellation monitors environment 50,000 times/sec",
      "Custom 11mm graphene audio drivers with punchy sub-bass",
      "32 hours total playback with USB-C / Qi wireless case",
      "IPX5 sweat and splash resistance",
      "Low latency gaming mode (<40ms)"
    ]),
    tags: JSON.stringify(["Audio", "Earbuds", "Wireless", "ANC", "Fitness"]),
    created_at: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    id: 16,
    name: "SwiftDesk Vegan Leather Oversized Desk Mat",
    sku: "WRK-MT-016",
    category: "Workspace Essentials",
    brand: "Apex Design",
    price: 42.00,
    compare_at_price: 50.00,
    stock: 60,
    rating: 4.8,
    reviews_count: 210,
    description: "Double-sided premium PU leather desk pad (90x45cm). Waterproof, oil-proof, scratch-resistant surface provides effortless mouse tracking and protects wood desk finishes.",
    image_url: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=800&q=80",
    secondary_images: JSON.stringify([
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80"
    ]),
    features: JSON.stringify([
      "Generous 90cm x 45cm (35.4\" x 17.7\") surface area",
      "Waterproof eco-friendly PU vegan leather on both sides",
      "Precision tracking for both optical and laser mice",
      "Non-slip backing stays planted during gaming or typing",
      "Includes matching cinch strap for portable use"
    ]),
    tags: JSON.stringify(["Desk Mat", "Accessories", "Workspace", "Leather"]),
    created_at: new Date(Date.now() - 86400000 * 11).toISOString()
  }
];

const seedReviews = [
  {
    product_id: 1,
    user_name: "Marcus Vance",
    user_avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80",
    rating: 5,
    title: "Best ANC headphones I have ever owned",
    comment: "The soundstage is wide, highs are crisp without harshness, and the hybrid ANC completely blocks out NYC subway roar. The memory foam pads are like clouds on my ears even after 8 hours of mixing.",
    created_at: new Date(Date.now() - 86400000 * 4).toISOString()
  },
  {
    product_id: 1,
    user_name: "Elena Rostova",
    user_avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80",
    rating: 5,
    title: "Remarkable build quality and microphone clarity",
    comment: "Colleagues on Zoom commented immediately that my voice sounded like a podcast studio mic. Battery life easily hits 38+ hours.",
    created_at: new Date(Date.now() - 86400000 * 9).toISOString()
  },
  {
    product_id: 2,
    user_name: "David Chen",
    user_avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80",
    rating: 5,
    title: "Indestructible titanium build and accurate GPS",
    comment: "Used this on a 4-day backcountry trek in Rainier. The battery had 35% left at the end of the trip and GPS breadcrumbs were spot-on.",
    created_at: new Date(Date.now() - 86400000 * 6).toISOString()
  },
  {
    product_id: 3,
    user_name: "Sarah Jenkins",
    user_avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80",
    rating: 5,
    title: "Worth every single penny",
    comment: "The solid walnut grain is gorgeous in person. The dual motors are so quiet my sleeping dog doesn't even budge when it changes height.",
    created_at: new Date(Date.now() - 86400000 * 13).toISOString()
  },
  {
    product_id: 4,
    user_name: "Julian Rivera",
    user_avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80",
    rating: 5,
    title: "Thocky, deep sound profile out of the box",
    comment: "The factory lubrication on switches and stabilizers is genuinely good. No rattle on spacebar. VIA web configuration worked seamlessly on Linux/Mac.",
    created_at: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    product_id: 6,
    user_name: "Claire Montgomery",
    user_avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=120&q=80",
    rating: 5,
    title: "A traveler's dream backpack",
    comment: "Surpassed a downpour in Seattle with zero water seepage inside. The laptop sleeve suspension really protects my 16-inch M3 MacBook.",
    created_at: new Date(Date.now() - 86400000 * 3).toISOString()
  }
];

module.exports = {
  seedProducts,
  seedReviews
};
