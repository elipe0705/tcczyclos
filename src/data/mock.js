import hoodie from "@/assets/product-hoodie.jpg";
import sneakers from "@/assets/product-sneakers.jpg";
import jacket from "@/assets/product-jacket.jpg";
import collection from "@/assets/product-collection.jpg";
export const products = [
    { id: "1", name: "Moletom lilás oversized", price: 180, image: hoodie, category: "Moletons", brand: "Nike", size: "M", condition: "Excelente", location: "São Paulo, SP", seller: "Lívia Rocha", deal: "Venda ou troca", style: "Streetwear", tags: ["conforto", "oversized"], description: "Moletom macio, pouco usado e em ótimo estado. Modelagem ampla e acabamento impecável." },
    { id: "2", name: "Tênis retrô laranja", price: 350, image: sneakers, category: "Tênis", brand: "Nike", size: "39", condition: "Muito bom", location: "Campinas, SP", seller: "Caio Mendes", deal: "Venda", style: "Casual", tags: ["retrô", "urbano"], description: "Tênis confortável, higienizado e com marcas discretas de uso na sola." },
    { id: "3", name: "Jaqueta workwear oliva", price: 280, image: jacket, category: "Jaquetas", brand: "Carhartt", size: "G", condition: "Excelente", location: "Curitiba, PR", seller: "Marina Luz", deal: "Troca", style: "Workwear", tags: ["atemporal", "algodão"], description: "Jaqueta estruturada com bolsos amplos. Uma peça versátil para meia-estação." },
    { id: "4", name: "Camiseta natureza", price: 100, image: collection, category: "Camisetas", brand: "Adidas", size: "P", condition: "Bom", location: "Belo Horizonte, MG", seller: "Ravi Alves", deal: "Venda ou troca", style: "Casual", tags: ["estampa", "leve"], description: "Camiseta confortável de algodão com estampa inspirada na natureza." },
    { id: "5", name: "Calça cargo preta", price: 145, image: collection, category: "Calças", brand: "Zara", size: "40", condition: "Muito bom", location: "Rio de Janeiro, RJ", seller: "Nina Costa", deal: "Venda", style: "Streetwear", tags: ["cargo", "preta"], description: "Calça cargo de cintura alta, tecido resistente e seis bolsos funcionais." },
    { id: "6", name: "Jaqueta vintage verde", price: 220, image: jacket, category: "Jaquetas", brand: "Levi's", size: "M", condition: "Bom", location: "Recife, PE", seller: "Bia Nunes", deal: "Venda ou troca", style: "Vintage", tags: ["vintage", "verde"], description: "Peça vintage autêntica, com sinais naturais de uso que fazem parte da história." },
];
export const categories = ["Camisetas", "Calças", "Moletons", "Jaquetas", "Shorts", "Vestidos", "Tênis", "Acessórios"];
export const conversations = [
    { id: 1, name: "Marina Luz", message: "A jaqueta ainda está disponível?", time: "10:42", unread: 2 },
    { id: 2, name: "Caio Mendes", message: "Gostei da sua proposta!", time: "Ontem", unread: 0 },
    { id: 3, name: "Bia Nunes", message: "Podemos combinar a entrega.", time: "Seg", unread: 0 },
];
export const notifications = [
    { id: 1, text: "João enviou uma proposta de troca.", time: "Há 5 min", kind: "troca" },
    { id: 2, text: "Maria começou a seguir você.", time: "Há 1 h", kind: "perfil" },
    { id: 3, text: "Seu anúncio recebeu um favorito.", time: "Há 3 h", kind: "favorito" },
    { id: 4, text: "Você recebeu uma nova mensagem.", time: "Ontem", kind: "mensagem" },
    { id: 5, text: "Sua proposta foi aceita.", time: "2 dias", kind: "sucesso" },
];
export const reviews = [
    { name: "Helena Martins", rating: 5, text: "Peça exatamente como descrita e atendimento muito gentil.", date: "12 set" },
    { name: "Lucas Freire", rating: 5, text: "Troca rápida e embalagem cuidadosa. Recomendo!", date: "28 ago" },
    { name: "Joana Lima", rating: 4, text: "Tudo certo com o produto e a entrega combinada.", date: "09 ago" },
];
export const adminUsers = [
    ["Lívia Rocha", "@liviar", "livia@exemplo.com", "12/09/2026", "Ativo"],
    ["Caio Mendes", "@caiom", "caio@exemplo.com", "04/09/2026", "Ativo"],
    ["Nina Costa", "@ninac", "nina@exemplo.com", "22/08/2026", "Suspenso"],
    ["Ravi Alves", "@ravialves", "ravi@exemplo.com", "17/08/2026", "Ativo"],
];
