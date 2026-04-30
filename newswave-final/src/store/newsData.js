// Centralized mock news data for the entire app
export const categories = [
  { slug: 'world', label: 'World', color: '#dc2626' },
  { slug: 'politics', label: 'Politics', color: '#7c3aed' },
  { slug: 'tech', label: 'Tech', color: '#0891b2' },
  { slug: 'business', label: 'Business', color: '#059669' },
  { slug: 'sports', label: 'Sports', color: '#d97706' },
  { slug: 'science', label: 'Science', color: '#0284c7' },
  { slug: 'entertainment', label: 'Entertainment', color: '#be185d' },
  { slug: 'health', label: 'Health', color: '#16a34a' }
  
]

export const articles = [
  // {
  //   id: 1,
  //   title: 'Global Climate Summit Reaches Historic Carbon Neutrality Agreement',
  //   excerpt: 'World leaders from 196 nations signed a landmark accord pledging full carbon neutrality by 2045, with binding enforcement mechanisms for the first time in history.',
  //   body: `World leaders from 196 nations convened in Geneva this week to sign the most ambitious climate accord in history. The agreement, dubbed the Geneva Pact, sets a binding target of full carbon neutrality by 2045 — five years earlier than previous commitments.\n\nFor the first time, the accord includes real enforcement mechanisms: countries that miss their interim targets will face automatic trade sanctions and can be suspended from international financial institutions.\n\n"This is not just another declaration," said UN Secretary-General António Guterres. "This is the beginning of the end of the fossil fuel era."\n\nThe accord covers emissions from industry, agriculture, and transportation. Wealthier nations pledged $2 trillion in climate finance for developing countries over the next decade. Renewable energy deployment commitments were tripled compared to the previous agreement.\n\nCritics, however, warn that enforcement remains the critical test. Similar accords have been signed before only to be undermined by shifting political winds and economic pressures. Environmental groups are cautiously optimistic but say citizen pressure will be vital to hold governments accountable.`,
  //   category: 'world',
  //   author: 'Sarah Mitchell',
  //   authorRole: 'Senior Correspondent',
  //   date: '2026-03-28',
  //   time: '09:41 AM',
  //   readTime: '5 min read',
  //   image: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1200&q=80',
  //   featured: true,
  //   trending: true,
  //   views: '2.4M'
  // },
  // {
  //   id: 2,
  //   title: 'Quantum Computing Breakthrough Cracks 2048-Bit Encryption',
  //   excerpt: 'MIT researchers demonstrate a quantum processor that can factor large primes in under 4 seconds, threatening the foundation of modern internet security.',
  //   body: `In a bombshell paper published today in Nature, MIT researchers announced that their 1,024-qubit processor successfully factored a 2048-bit RSA key in 3.7 seconds — a task that would take classical supercomputers millions of years.\n\nThe implications are seismic. RSA-2048 encryption secures the majority of the world's financial transactions, government communications, and private data. Cryptographers have long feared this day, but few expected it to arrive so soon.\n\n"We are not saying existing systems are immediately at risk," said lead researcher Dr. Priya Nair. "But we are saying the clock has started."\n\nThe breakthrough comes from a novel error-correction algorithm that dramatically improves qubit coherence times. The team was able to sustain computation for over 10 seconds — long enough to break large keys.\n\nGovernments and tech companies are scrambling. The US NIST has already been developing post-quantum cryptography standards, but widespread deployment is years away. Banks and defense agencies were briefed privately before the publication.`,
  //   category: 'tech',
  //   author: 'James Park',
  //   authorRole: 'Tech Editor',
  //   date: '2026-03-28',
  //   time: '08:15 AM',
  //   readTime: '6 min read',
  //   image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&q=80',
  //   featured: true,
  //   trending: true,
  //   views: '1.8M'
  // },
  // {
  //   id: 3,
  //   title: 'Stock Markets Hit Record High on Strong Jobs Data',
  //   excerpt: 'The S&P 500 surpassed 7,200 for the first time as February jobs report showed 420,000 new positions, exceeding all analyst forecasts.',
  //   body: `Wall Street surged to record territory Friday after the Labor Department reported the creation of 420,000 new jobs in February, crushing the median economist forecast of 280,000 and sending the S&P 500 to 7,234 — a new all-time high.\n\nThe unemployment rate ticked down to 3.4%, while average hourly earnings rose 0.4% month-over-month, suggesting a labor market that remains remarkably resilient despite 18 months of elevated interest rates.\n\nTechnology stocks led the rally, with the Nasdaq Composite gaining 2.8%. Energy and financials also outperformed. The Dow Jones Industrial Average added 680 points, or 1.6%.\n\n"This is a goldilocks report," said Maria Santos, chief economist at Goldman Sachs. "Strong enough to show the economy is healthy, but not so hot that it forces the Fed to pivot back to hiking."\n\nFederal Reserve officials maintained their stance that rate cuts are on the horizon but stressed they need to see more evidence of cooling inflation before acting.`,
  //   category: 'business',
  //   author: 'Elena Rodriguez',
  //   authorRole: 'Finance Reporter',
  //   date: '2026-03-27',
  //   time: '04:30 PM',
  //   readTime: '4 min read',
  //   image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=80',
  //   featured: false,
  //   trending: true,
  //   views: '890K'
  // },
  // // {
  // //   id: 4,
  // //   title: 'Mars Colony Alpha Celebrates One Year of Continuous Habitation',
  // //   excerpt: 'The twelve-person crew of humanity\'s first permanent Mars outpost marked a milestone year, having grown their own food and established a functioning water cycle.',
  // //   body: `It has been one year since humanity set foot permanently on Mars, and the twelve-person crew of Colony Alpha has not just survived — they have thrived. Friday marked the anniversary of their landing, celebrated with a specially grown meal of potatoes, lettuce, and wheat — all cultivated in Martian regolith.\n\nThe colony, located in Hellas Planitia, has exceeded all mission benchmarks. The crew successfully established a closed-loop water extraction system from subsurface ice, built two pressurized greenhouse modules, and conducted over 200 geological surveys.\n\n"We are not visitors anymore," said Commander Yuki Tanaka in a video message to Earth. "We are Martians."\n\nThe success of Alpha has accelerated planning for Colony Beta, a larger 50-person settlement proposed for 2029. Private companies have already filed applications to build supply missions.\n\nThe mission, a joint effort of NASA, ESA, and JAXA, represents the culmination of 60 years of robotic exploration and two decades of crewed preparation.`,
  // //   category: 'science',
  // //   author: 'David Chen',
  // //   authorRole: 'Science Correspondent',
  // //   date: '2026-03-27',
  // //   time: '11:00 AM',
  // //   readTime: '7 min read',
  // //   image: 'https://images.unsplash.com/photo-1614726365952-510103b1bdb8?w=800&q=80',
  // //   featured: false,
  // //   trending: true,
  // //   views: '3.1M'
  // // },
  // {
  //   id: 5,
  //   title: 'Champions League Quarter-Finals: Upset of the Decade',
  //   excerpt: 'Minnow FC Braga stuns defending champions Manchester City 4-1 at the Etihad, sending shockwaves through European football.',
  //   body: `In one of the most sensational results in Champions League history, Portuguese side FC Braga demolished Manchester City 4-1 at the Etihad Stadium on Wednesday night, completing a stunning aggregate victory that ends the English giants' title defense.\n\nTwo goals from striker Carlos Vidal, a Guardiola own goal, and a stunning long-range strike from midfielder Rafael Santos sealed a result that had 55,000 stunned City fans filing out in disbelief with twenty minutes still to play.\n\nCity had reached the quarter-finals as heavy favourites, unbeaten in the league and seemingly unstoppable in European competition. Braga, by contrast, had never reached the last eight before and were 14/1 underdogs at kickoff.\n\n"Football is the most beautiful sport in the world because anything is possible," said Braga coach Jorge Costa, visibly emotional.\n\nThe result sets up a semi-final against Real Madrid, who earlier eliminated Bayern Munich 3-2 on aggregate. The other semi-final sees Barcelona face Paris Saint-Germain.`,
  //   category: 'sports',
  //   author: 'Marcus Williams',
  //   authorRole: 'Sports Editor',
  //   date: '2026-03-26',
  //   time: '11:45 PM',
  //   readTime: '4 min read',
  //   image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&q=80',
  //   featured: false,
  //   trending: true,
  //   views: '4.2M'
  // },
  // {
  //   id: 6,
  //   title: 'New Study Links Ultra-Processed Food to Accelerated Brain Aging',
  //   excerpt: 'Harvard research tracking 52,000 adults over 20 years finds diets high in UPF are associated with 7-10 years of additional cognitive aging.',
  //   body: `A sweeping 20-year study from Harvard Medical School has found that adults who consume diets high in ultra-processed foods (UPF) show cognitive decline equivalent to 7 to 10 years of additional aging compared to peers who eat minimally processed diets.\n\nThe research, published in the New England Journal of Medicine, tracked 52,000 adults aged 40-80 across six countries. Cognitive function was assessed every two years using a battery of standardized tests measuring memory, processing speed, and executive function.\n\nThose in the highest quartile of UPF consumption showed significantly faster decline across all metrics. The effect persisted even after controlling for overall caloric intake, socioeconomic status, physical activity, and other lifestyle factors.\n\n"This isn't about occasional junk food," said lead author Dr. Amara Osei. "This is about a dietary pattern that is structurally different from what humans evolved to eat."\n\nUltra-processed foods include packaged snacks, sodas, ready meals, and industrially formulated breads and cereals. They now account for over 60% of calories consumed in the United States.`,
  //   category: 'health',
  //   author: 'Dr. Lisa Patel',
  //   authorRole: 'Health Correspondent',
  //   date: '2026-03-26',
  //   time: '09:00 AM',
  //   readTime: '5 min read',
  //   image: 'https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=800&q=80',
  //   featured: false,
  //   trending: false,
  //   views: '1.2M'
  // },
  // {
  //   id: 7,
  //   title: 'US Senate Passes Sweeping AI Regulation Act in Bipartisan Vote',
  //   excerpt: 'The Responsible AI Development Act mandates transparency audits, bias testing, and human oversight requirements for all AI systems used in critical infrastructure.',
  //   body: `The United States Senate passed the Responsible AI Development Act on Thursday in a rare 78-21 bipartisan vote, marking the most significant federal regulation of artificial intelligence in the technology's history.\n\nThe bill requires companies deploying AI systems in critical infrastructure — including energy grids, financial systems, healthcare, and transportation — to submit to annual third-party transparency audits, bias testing, and demonstrate meaningful human oversight mechanisms.\n\nFor general-purpose AI models above a compute threshold, developers must file safety disclosures with a newly created AI Safety Authority, modeled loosely on the FDA's drug approval process.\n\nTech companies had largely lobbied against the bill, though several large firms ultimately declared support for what they called "reasonable guardrails." Smaller startups and civil liberties groups offered more mixed assessments.\n\n"This is a foundation, not a ceiling," said Senator Maria Torres (D-CA), a co-sponsor. "We expect this law to evolve as the technology evolves."`,
  //   category: 'politics',
  //   author: 'Thomas Bailey',
  //   authorRole: 'Political Correspondent',
  //   date: '2026-03-25',
  //   time: '06:30 PM',
  //   readTime: '5 min read',
  //   image: 'https://images.unsplash.com/photo-1555848962-6e79363ec58f?w=800&q=80',
  //   featured: false,
  //   trending: false,
  //   views: '760K'
  // },
  // {
  //   id: 8,
  //   title: 'Taylor Swift\'s Eras Tour Film Breaks All-Time Streaming Record',
  //   excerpt: 'The extended director\'s cut of the concert film amassed 220 million views in its first 24 hours on streaming, shattering all previous records.',
  //   body: `Taylor Swift's "Eras Tour: The Complete Film" shattered streaming records on its first day of release, accumulating 220 million views in 24 hours across all platforms — eclipsing the previous record by more than 80 million.\n\nThe extended 4-hour director's cut includes 18 previously unseen performances and documentary footage from backstage and rehearsals, as well as a new acoustic set filmed exclusively for the release.\n\nThe film generated $42 million in day-one revenue from premium video-on-demand purchases, adding to what has become the highest-grossing concert tour in history at over $2.1 billion.\n\nSocial media erupted, with "Eras Film" trending globally on every major platform simultaneously — a first in social media history, according to tracking firm Brandwatch.\n\n"I wanted to give the fans who couldn't see every show the chance to experience what it felt like from the inside," Swift said in a statement.`,
  //   category: 'entertainment',
  //   author: 'Naomi Clark',
  //   authorRole: 'Entertainment Reporter',
  //   date: '2026-03-25',
  //   time: '08:00 AM',
  //   readTime: '3 min read',
  //   image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80',
  //   featured: false,
  //   trending: false,
  //   views: '5.6M'
  // },
  // {
  //   id: 9,
  //   title: 'Pakistan Emerges as World\'s Third-Largest Solar Producer',
  //   excerpt: 'Massive investment in the Thar Desert solar corridor propels Pakistan to a top-3 global ranking, with 80GW of installed capacity ahead of schedule.',
  //   body: `Pakistan has officially surpassed Germany and Japan to become the world's third-largest solar energy producer, the International Energy Agency confirmed this week, with 80 gigawatts of installed capacity — a figure achieved three years ahead of the government's own projections.\n\nThe transformation, centered on the vast Thar Desert solar corridor in Sindh province, has been driven by a combination of state investment, Chinese financing through CPEC, and a dramatic drop in solar panel costs.\n\n"Ten years ago, this was desert. Today it powers 30 million homes," said Energy Minister Zubair Ahmed.\n\nThe shift has had profound economic consequences. Pakistan's electricity import bill has dropped by 60%, foreign exchange reserves have stabilized, and an emerging solar manufacturing industry is creating 400,000 jobs. The country aims to be 90% renewable by 2035.`,
  //   category: 'world',
  //   author: 'Ayesha Khan',
  //   authorRole: 'South Asia Correspondent',
  //   date: '2026-03-24',
  //   time: '10:00 AM',
  //   readTime: '4 min read',
  //   image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&q=80',
  //   featured: false,
  //   trending: false,
  //   views: '340K'
  // },
  // {
  //   id: 10,
  //   title: 'SpaceX Starship Completes First Lunar Orbit Mission',
  //   excerpt: 'Fully reusable Starship completes a 12-day lunar orbital mission, retrieving two NASA satellites and demonstrating refueling in deep space.',
  //   body: `SpaceX's Starship completed its most ambitious mission to date on Saturday, successfully returning to Earth after a 12-day lunar orbital mission that included rendezvous and refueling operations in cislunar space and the retrieval of two aging NASA communication satellites.\n\nThe mission, designated SL-7, marks a pivotal milestone in the Artemis program and validates the deep-space refueling architecture that will be essential for crewed lunar landings planned for 2027.\n\nStarship launched from Boca Chica, Texas, performed two in-space refueling operations with tanker vehicles, completed four lunar orbits, deployed a next-generation lunar relay satellite, captured the two legacy NASA assets, and returned to land at Cape Canaveral — all without a single hardware loss.\n\n"This is what full reusability looks like," said SpaceX CEO Elon Musk. "The economics of space just changed permanently."\n\nThe total mission cost, according to NASA, was approximately $340 million — a fraction of what equivalent missions cost under previous architectures.`,
  //   category: 'science',
  //   author: 'David Chen',
  //   authorRole: 'Science Correspondent',
  //   date: '2026-03-23',
  //   time: '02:15 PM',
  //   readTime: '6 min read',
  //   image: 'https://images.unsplash.com/photo-1541185934-01b600ea069c?w=800&q=80',
  //   featured: false,
  //   trending: false,
  //   views: '2.7M'
  // },
  // {
  //   id: 11,
  //   title: 'Antibiotics Crisis: WHO Declares Global Emergency Over Resistant Bacteria',
  //   excerpt: 'Drug-resistant infections now kill 1.8 million people annually as the last-resort antibiotic pipeline dries up, prompting the WHO\'s most urgent health declaration in a decade.',
  //   body: `The World Health Organization declared a global health emergency over antimicrobial resistance on Friday, citing data showing drug-resistant infections now kill 1.8 million people annually — more than HIV/AIDS and malaria combined.\n\nThe declaration, WHO's most serious health alert since the COVID-19 pandemic, comes as pharmaceutical pipelines for new antibiotics have nearly dried up. Only four new classes of antibiotics have reached market in the past 40 years, while resistance to existing drugs has accelerated dramatically.\n\n"We are approaching a world where routine surgeries become life-threatening," said WHO Director-General Dr. Fatima Al-Sayed. "A post-antibiotic era is no longer science fiction."\n\nThe emergency triggers $8 billion in emergency research funding from the G7 and grants WHO emergency powers to requisition antibiotic stockpiles and coordinate global distribution. A new global treaty to reduce antibiotic overuse in agriculture, the primary driver of resistance, is expected to be tabled at the next General Assembly.`,
  //   category: 'health',
  //   author: 'Dr. Lisa Patel',
  //   authorRole: 'Health Correspondent',
  //   date: '2026-03-22',
  //   time: '03:00 PM',
  //   readTime: '5 min read',
  //   image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&q=80',
  //   featured: false,
  //   trending: false,
  //   views: '1.5M'
  // },
  // {
  //   id: 12,
  //   title: 'OpenAI GPT-6 Passes Bar Exam with 99th Percentile Score',
  //   excerpt: 'The latest model achieves unprecedented performance on professional benchmarks while introducing a new "constitutional reasoning" safety framework.',
  //   body: `OpenAI released GPT-6 on Tuesday, a model that achieves 99th percentile scores on the US Bar Exam, USMLE medical licensing exam, and CFA financial certification — decisively outperforming all previous AI systems and the vast majority of human professionals on these benchmarks.\n\nBeyond raw benchmark performance, the company claims GPT-6 incorporates a fundamentally new "constitutional reasoning" framework that hardcodes ethical constraints at the architectural level rather than relying solely on post-training fine-tuning.\n\nEarly access evaluators in law, medicine, and finance describe the model's outputs as qualitatively different from previous versions — more structured, more aware of uncertainty, and more apt to refuse tasks it cannot complete reliably.\n\n"This is not a quantitative improvement over GPT-5," said OpenAI CEO Sam Altman. "This is a different kind of system."\n\nThe model is initially available via API only, with enterprise pricing. Consumer access will be phased over 90 days pending final safety evaluations.`,
  //   category: 'tech',
  //   author: 'James Park',
  //   authorRole: 'Tech Editor',
  //   date: '2026-03-21',
  //   time: '10:00 AM',
  //   readTime: '5 min read',
  //   image: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=800&q=80',
  //   featured: false,
  //   trending: false,
  //   views: '3.3M'
  // },
]

export function getArticleById(id) {
  return articles.find(a => a.id === Number(id))
}

export function getArticlesByCategory(slug) {
  return articles.filter(a => a.category === slug)
}

export function getFeaturedArticles() {
  return articles.filter(a => a.featured)
}

export function getTrendingArticles(limit = 5) {
  return articles.filter(a => a.trending).slice(0, limit)
}

export function getLatestArticles(limit = 8) {
  return articles.slice(0, limit)
}

export function searchArticles(query) {
  const q = query.toLowerCase()
  return articles.filter(a =>
    a.title.toLowerCase().includes(q) ||
    a.excerpt.toLowerCase().includes(q) ||
    a.category.includes(q)
  )
}
