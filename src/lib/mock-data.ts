import { format, subDays, subMonths } from "date-fns";

export interface Order {
  id: string;
  customer: string;
  email: string;
  product: string;
  amount: number;
  status: "completed" | "pending" | "shipped" | "cancelled";
  date: string;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  model: string;
  category: string;
  price: number;
  stock: number;
  suspension: string;
  frameMaterial: string;
  wheelSize: string;
  gears: number;
  accessories: string[];
  image: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  joined: string;
  orders: number;
  totalSpent: number;
  status: "active" | "inactive";
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  date: string;
  status: "new" | "read" | "replied";
}

export interface Brand {
  id: string;
  name: string;
  country: string;
  products: number;
  logo: string;
}

export interface EventItem {
  id: string;
  title: string;
  date: string;
  location: string;
  type: "sale" | "launch" | "workshop" | "race";
  status: "upcoming" | "ongoing" | "completed";
}

export interface Accessory {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  compatible: string[];
}

export interface Category {
  id: string;
  name: string;
  description: string;
  productCount: number;
}

const today = new Date();

export const orders: Order[] = [
  { id: "ORD-001", customer: "Alex Johnson", email: "alex@mail.com", product: "Trek Domane SL 7", amount: 4599, status: "completed", date: format(subDays(today, 0), "yyyy-MM-dd") },
  { id: "ORD-002", customer: "Maria Garcia", email: "maria@mail.com", product: "Specialized Roubaix", amount: 3899, status: "shipped", date: format(subDays(today, 1), "yyyy-MM-dd") },
  { id: "ORD-003", customer: "James Wilson", email: "james@mail.com", product: "Giant Defy Advanced", amount: 2999, status: "pending", date: format(subDays(today, 2), "yyyy-MM-dd") },
  { id: "ORD-004", customer: "Sarah Chen", email: "sarah@mail.com", product: "Canyon Endurace", amount: 2499, status: "completed", date: format(subDays(today, 5), "yyyy-MM-dd") },
  { id: "ORD-005", customer: "David Kim", email: "david@mail.com", product: "Santa Cruz Hightower", amount: 5999, status: "completed", date: format(subDays(today, 7), "yyyy-MM-dd") },
  { id: "ORD-006", customer: "Emma Brown", email: "emma@mail.com", product: "Cannondale Topstone", amount: 3199, status: "shipped", date: format(subDays(today, 10), "yyyy-MM-dd") },
  { id: "ORD-007", customer: "Ryan Patel", email: "ryan@mail.com", product: "BMC Roadmachine", amount: 4299, status: "cancelled", date: format(subDays(today, 14), "yyyy-MM-dd") },
  { id: "ORD-008", customer: "Lisa Wang", email: "lisa@mail.com", product: "Cervelo Caledonia", amount: 5199, status: "completed", date: format(subDays(today, 20), "yyyy-MM-dd") },
  { id: "ORD-009", customer: "Tom Martinez", email: "tom@mail.com", product: "Scott Addict RC", amount: 4799, status: "pending", date: format(subDays(today, 25), "yyyy-MM-dd") },
  { id: "ORD-010", customer: "Nina Taylor", email: "nina@mail.com", product: "Pinarello Dogma", amount: 8999, status: "completed", date: format(subMonths(today, 1), "yyyy-MM-dd") },
  { id: "ORD-011", customer: "Chris Lee", email: "chris@mail.com", product: "Specialized Stumpjumper", amount: 4599, status: "shipped", date: format(subMonths(today, 1), "yyyy-MM-dd") },
  { id: "ORD-012", customer: "Amy Foster", email: "amy@mail.com", product: "Trek Fuel EX", amount: 3799, status: "completed", date: format(subMonths(today, 2), "yyyy-MM-dd") },
];

export const products: Product[] = [
  { id: "P001", name: "Trek Domane SL 7", brand: "Trek", model: "Domane SL 7", category: "Road", price: 4599, stock: 12, suspension: "None (Rigid)", frameMaterial: "Carbon", wheelSize: "700c", gears: 22, accessories: ["Bottle Cage", "Pedals", "Saddle Bag"], image: "" },
  { id: "P002", name: "Specialized Stumpjumper", brand: "Specialized", model: "Stumpjumper EVO", category: "Mountain", price: 4599, stock: 8, suspension: "Full (Fox 36 / Fox DPX2)", frameMaterial: "Carbon", wheelSize: "29\"", gears: 12, accessories: ["Dropper Post", "Tubeless Kit"], image: "" },
  { id: "P003", name: "Giant Defy Advanced", brand: "Giant", model: "Defy Advanced 1", category: "Road", price: 2999, stock: 15, suspension: "None (Rigid)", frameMaterial: "Carbon", wheelSize: "700c", gears: 22, accessories: ["Bottle Cage", "Lights"], image: "" },
  { id: "P004", name: "Canyon Endurace", brand: "Canyon", model: "Endurace CF SL", category: "Endurance", price: 2499, stock: 20, suspension: "None (Rigid)", frameMaterial: "Carbon", wheelSize: "700c", gears: 22, accessories: ["Saddle Bag", "Bell"], image: "" },
  { id: "P005", name: "Santa Cruz Hightower", brand: "Santa Cruz", model: "Hightower C", category: "Mountain", price: 5999, stock: 5, suspension: "Full (Fox 34 / Fox Float X)", frameMaterial: "Carbon", wheelSize: "29\"", gears: 12, accessories: ["Dropper Post", "Frame Guard"], image: "" },
  { id: "P006", name: "Cannondale Topstone", brand: "Cannondale", model: "Topstone Carbon", category: "Gravel", price: 3199, stock: 10, suspension: "Kingpin Suspension", frameMaterial: "Carbon", wheelSize: "700c", gears: 22, accessories: ["Fenders", "Rack Mount"], image: "" },
  { id: "P007", name: "BMC Roadmachine", brand: "BMC", model: "Roadmachine 01", category: "Road", price: 4299, stock: 7, suspension: "None (Rigid)", frameMaterial: "Carbon", wheelSize: "700c", gears: 24, accessories: ["Aero Bars", "Bottle Cage"], image: "" },
  { id: "P008", name: "Cervelo Caledonia", brand: "Cervelo", model: "Caledonia-5", category: "Road", price: 5199, stock: 4, suspension: "None (Rigid)", frameMaterial: "Carbon", wheelSize: "700c", gears: 24, accessories: ["Power Meter", "Saddle Bag"], image: "" },
];

export const users: User[] = [
  { id: "U001", name: "Alex Johnson", email: "alex@mail.com", joined: format(subMonths(today, 8), "yyyy-MM-dd"), orders: 5, totalSpent: 12500, status: "active" },
  { id: "U002", name: "Maria Garcia", email: "maria@mail.com", joined: format(subMonths(today, 6), "yyyy-MM-dd"), orders: 3, totalSpent: 8700, status: "active" },
  { id: "U003", name: "James Wilson", email: "james@mail.com", joined: format(subMonths(today, 4), "yyyy-MM-dd"), orders: 2, totalSpent: 5400, status: "active" },
  { id: "U004", name: "Sarah Chen", email: "sarah@mail.com", joined: format(subMonths(today, 3), "yyyy-MM-dd"), orders: 1, totalSpent: 2499, status: "active" },
  { id: "U005", name: "David Kim", email: "david@mail.com", joined: format(subMonths(today, 12), "yyyy-MM-dd"), orders: 8, totalSpent: 22000, status: "active" },
  { id: "U006", name: "Emma Brown", email: "emma@mail.com", joined: format(subMonths(today, 2), "yyyy-MM-dd"), orders: 1, totalSpent: 3199, status: "inactive" },
];

export const contacts: ContactMessage[] = [
  { id: "C001", name: "John Doe", email: "john@mail.com", subject: "Warranty Inquiry", message: "I need warranty info for my Trek Domane.", date: format(subDays(today, 0), "yyyy-MM-dd"), status: "new" },
  { id: "C002", name: "Jane Smith", email: "jane@mail.com", subject: "Return Request", message: "I'd like to return my recent order.", date: format(subDays(today, 1), "yyyy-MM-dd"), status: "read" },
  { id: "C003", name: "Bob Martin", email: "bob@mail.com", subject: "Bulk Order", message: "Interested in bulk pricing for corporate fleet.", date: format(subDays(today, 3), "yyyy-MM-dd"), status: "replied" },
  { id: "C004", name: "Alice Cooper", email: "alice@mail.com", subject: "Custom Build", message: "Can you do a custom build with specific components?", date: format(subDays(today, 7), "yyyy-MM-dd"), status: "new" },
  { id: "C005", name: "Mike Ross", email: "mike@mail.com", subject: "Sponsorship", message: "Looking for sponsorship for local cycling team.", date: format(subMonths(today, 1), "yyyy-MM-dd"), status: "read" },
];

export const brands: Brand[] = [
  { id: "B001", name: "Trek", country: "USA", products: 24, logo: "🚲" },
  { id: "B002", name: "Specialized", country: "USA", products: 18, logo: "🏔️" },
  { id: "B003", name: "Giant", country: "Taiwan", products: 30, logo: "🌏" },
  { id: "B004", name: "Canyon", country: "Germany", products: 15, logo: "🏜️" },
  { id: "B005", name: "Santa Cruz", country: "USA", products: 12, logo: "🌲" },
  { id: "B006", name: "Cannondale", country: "USA", products: 20, logo: "⚡" },
  { id: "B007", name: "BMC", country: "Switzerland", products: 14, logo: "🇨🇭" },
  { id: "B008", name: "Cervelo", country: "Canada", products: 10, logo: "🍁" },
];

export const events: EventItem[] = [
  { id: "E001", title: "Summer Sale 2026", date: format(subDays(today, -10), "yyyy-MM-dd"), location: "Online", type: "sale", status: "upcoming" },
  { id: "E002", title: "Canyon Gravel Launch", date: format(subDays(today, -5), "yyyy-MM-dd"), location: "Berlin, Germany", type: "launch", status: "upcoming" },
  { id: "E003", title: "MTB Skills Workshop", date: format(subDays(today, 2), "yyyy-MM-dd"), location: "Denver, CO", type: "workshop", status: "completed" },
  { id: "E004", title: "CycleHub Charity Race", date: format(subDays(today, -20), "yyyy-MM-dd"), location: "San Francisco, CA", type: "race", status: "upcoming" },
  { id: "E005", title: "Spring Clearance", date: format(subDays(today, 30), "yyyy-MM-dd"), location: "Online", type: "sale", status: "completed" },
];

export const accessories: Accessory[] = [
  { id: "A001", name: "Carbon Bottle Cage", category: "Hydration", price: 45, stock: 120, compatible: ["Road", "Gravel", "Mountain"] },
  { id: "A002", name: "Fox 36 Fork", category: "Suspension", price: 899, stock: 15, compatible: ["Mountain"] },
  { id: "A003", name: "Shimano Ultegra Pedals", category: "Pedals", price: 179, stock: 45, compatible: ["Road", "Gravel"] },
  { id: "A004", name: "Garmin Edge 840", category: "Electronics", price: 399, stock: 30, compatible: ["Road", "Mountain", "Gravel"] },
  { id: "A005", name: "Topeak Saddle Bag", category: "Storage", price: 35, stock: 200, compatible: ["Road", "Gravel", "Endurance"] },
  { id: "A006", name: "Continental GP5000 Tires", category: "Tires", price: 69, stock: 80, compatible: ["Road", "Endurance"] },
  { id: "A007", name: "Crank Brothers Dropper Post", category: "Components", price: 249, stock: 25, compatible: ["Mountain"] },
  { id: "A008", name: "Lezyne Floor Pump", category: "Tools", price: 59, stock: 60, compatible: ["Road", "Mountain", "Gravel"] },
];

export const categories: Category[] = [
  { id: "CAT01", name: "Road", description: "High-performance road racing and endurance bikes", productCount: 15 },
  { id: "CAT02", name: "Mountain", description: "Trail, enduro, and cross-country mountain bikes", productCount: 12 },
  { id: "CAT03", name: "Gravel", description: "Adventure and gravel-ready bikes", productCount: 8 },
  { id: "CAT04", name: "Endurance", description: "Long-distance comfort-focused bikes", productCount: 6 },
  { id: "CAT05", name: "Electric", description: "E-bikes for assisted riding", productCount: 10 },
  { id: "CAT06", name: "Urban", description: "City commuters and hybrid bikes", productCount: 9 },
];

export const salesData = [
  { month: "Jan", sales: 42000, orders: 28 },
  { month: "Feb", sales: 38000, orders: 24 },
  { month: "Mar", sales: 55000, orders: 35 },
  { month: "Apr", sales: 49000, orders: 31 },
  { month: "May", sales: 62000, orders: 40 },
  { month: "Jun", sales: 58000, orders: 37 },
];