
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  try {
    // ----------- USERS -----------
    const usersData = [
      { username: "Luna", password: "luna123", profileText: "🌙 Stargazer & night owl" },
      { username: "Max", password: "max123", profileText: "🏋️‍♂️ Gym rat & coffee addict" },
      { username: "Sophie", password: "sophie123", profileText: "🎨 Artist & cat lover" },
      { username: "Ethan", password: "ethan123", profileText: "💻 Full-stack dev & gamer" },
      { username: "Mia", password: "mia123", profileText: "📚 Bookworm & tea enthusiast" },
      { username: "Leo", password: "leo123", profileText: "🛹 Skateboarder & photographer" },
      { username: "Ava", password: "ava123", profileText: "🌿 Plant mom & baker" },
      { username: "Noah", password: "noah123", profileText: "🎧 Music producer & traveler" },
      { username: "Chloe", password: "chloe123", profileText: "✈️ Wanderlust & foodie" },
      { username: "Liam", password: "liam123", profileText: "🧩 Puzzle solver & coder" },
    ];

    const users = [];
    for (const u of usersData) {
      const hashedPassword = await bcrypt.hash(u.password, 10);
      const user = await prisma.user.upsert({
        where: { username: u.username },
        update: {},
        create: {
          username: u.username,
          password: hashedPassword,
          role: "user",
          profileText: u.profileText,
          profileImage: `https://i.pravatar.cc/150?u=${u.username}`,
          profileBanner: `https://picsum.photos/600/200?random=${Math.floor(Math.random() * 1000)}`,
        },
      });
      users.push(user);
    }
    console.log("Users created:", users.map(u => u.username));

   // ----------- COMMUNITIES -----------
const communitiesData = [
  { name: "Tech Lovers", description: "All about technology and gadgets", image: `https://picsum.photos/400/200?random=${Math.floor(Math.random() * 1000)}` },
  { name: "Bookworms", description: "Discuss and share books", image: `https://picsum.photos/400/200?random=${Math.floor(Math.random() * 1000)}` },
  { name: "Outdoor Adventures", description: "Hiking, camping, and nature", image: `https://picsum.photos/400/200?random=${Math.floor(Math.random() * 1000)}` },
  { name: "Foodies", description: "Recipes, restaurants, and cooking tips", image: `https://picsum.photos/400/200?random=${Math.floor(Math.random() * 1000)}` },
  { name: "Music Fans", description: "Sharing music, albums, and concerts", image: `https://picsum.photos/400/200?random=${Math.floor(Math.random() * 1000)}` },
  { name: "Art & Design", description: "For creative minds and artists", image: `https://picsum.photos/400/200?random=${Math.floor(Math.random() * 1000)}` },
];

const communities = [];
for (const c of communitiesData) {
  const community = await prisma.community.upsert({
    where: { name: c.name },
    update: {},
    create: {
      name: c.name,
      description: c.description,
      image: c.image, // ← now each seeded community has an image
    },
  });
  communities.push(community);
}
console.log("Communities created:", communities.map(c => c.name));


    // ----------- TOPICS -----------
    const topicsData = [
      { title: "React Tips", ownerIndex: 3, communityIndex: 0 },
      { title: "Node.js Deep Dive", ownerIndex: 0, communityIndex: 0 },
      { title: "Hiking Trails", ownerIndex: 1, communityIndex: 2 },
      { title: "Street Photography", ownerIndex: 2, communityIndex: 5 },
      { title: "Vegan Recipes", ownerIndex: 4, communityIndex: 3 },
      { title: "AI & Future Tech", ownerIndex: 5, communityIndex: 0 },
      { title: "Mystery Novels", ownerIndex: 6, communityIndex: 1 },
      { title: "City Travel Guides", ownerIndex: 7, communityIndex: 2 },
      { title: "Coffee Brewing", ownerIndex: 8, communityIndex: 3 },
      { title: "Sketching Basics", ownerIndex: 2, communityIndex: 5 },
      { title: "Mountain Climbing", ownerIndex: 1, communityIndex: 2 },
      { title: "Music Production", ownerIndex: 9, communityIndex: 4 },
    ];

    const topics = [];
    for (const t of topicsData) {
      const topic = await prisma.topic.upsert({
        where: { title: t.title },
        update: {},
        create: {
          title: t.title,
          description: `Discussion about ${t.title}`,
          ownerId: users[t.ownerIndex].id,
          communityId: communities[t.communityIndex].community_id,
          image: `https://picsum.photos/400/200?random=${Math.floor(Math.random() * 1000)}`,
        },
      });
      topics.push(topic);
    }
    console.log("Topics created:", topics.map(t => t.title));

    // ----------- POSTS -----------
    const postsData = [
      { title: "My first post!", topicIndex: 0, userIndex: 0 },
      { title: "Node.js async patterns", topicIndex: 1, userIndex: 3 },
      { title: "Amazing hiking trail pics", topicIndex: 2, userIndex: 1 },
      { title: "Street photography tips", topicIndex: 3, userIndex: 2 },
      { title: "Vegan lasagna recipe", topicIndex: 4, userIndex: 4 },
      { title: "AI vs humans", topicIndex: 5, userIndex: 5 },
      { title: "Best mystery novels 2026", topicIndex: 6, userIndex: 6 },
      { title: "Top 5 cities to visit", topicIndex: 7, userIndex: 7 },
      { title: "Cold brew coffee guide", topicIndex: 8, userIndex: 8 },
      { title: "Sketching 101", topicIndex: 9, userIndex: 2 },
      { title: "Climbing gear essentials", topicIndex: 10, userIndex: 1 },
      { title: "Music mixing tips", topicIndex: 11, userIndex: 9 },
      { title: "React state management", topicIndex: 0, userIndex: 3 },
      { title: "Async/await gotchas", topicIndex: 1, userIndex: 3 },
      { title: "Hidden waterfalls", topicIndex: 2, userIndex: 1 },
      { title: "Urban photography", topicIndex: 3, userIndex: 2 },
      { title: "Healthy vegan snacks", topicIndex: 4, userIndex: 4 },
      { title: "AI in gaming", topicIndex: 5, userIndex: 5 },
    ];

    const posts = [];
    for (const p of postsData) {
      const post = await prisma.post.create({
        data: {
          title: p.title,
          content: `Content for post: ${p.title}`,
          upvotes: Math.floor(Math.random() * 500),
          downvotes: Math.floor(Math.random() * 50),
          user_id: users[p.userIndex].id,
          topic_id: topics[p.topicIndex].topic_id,
          image: `https://picsum.photos/300/200?random=${Math.floor(Math.random() * 1000)}`,
        },
      });
      posts.push(post);
    }
    console.log("Posts created:", posts.length);

    // ----------- COMMENTS -----------
    const commentsData = [
      { postIndex: 0, userIndex: 1, content: "Great post!" },
      { postIndex: 1, userIndex: 0, content: "Thanks for sharing." },
      { postIndex: 2, userIndex: 3, content: "Beautiful photos!" },
      { postIndex: 3, userIndex: 4, content: "Awesome tips." },
      { postIndex: 4, userIndex: 5, content: "Yummy!" },
      { postIndex: 5, userIndex: 6, content: "Interesting insights." },
      { postIndex: 6, userIndex: 7, content: "Adding to my reading list." },
      { postIndex: 7, userIndex: 8, content: "Nice travel tips." },
    ];

    for (const c of commentsData) {
      await prisma.comment.create({
        data: {
          content: c.content,
          post_id: posts[c.postIndex].post_id,
          user_id: users[c.userIndex].id,
        },
      });
    }
    console.log("Comments created");

    // ----------- FOLLOWS -----------
    await prisma.follow.create({
      data: { follower_id: users[0].id, followed_user_id: users[1].id },
    });
    await prisma.follow.create({
      data: { follower_id: users[2].id, followed_user_id: users[3].id },
    });
    console.log("Follows created");

  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error("Unhandled error during seeding:", error);
  process.exit(1);
});





/*
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Delete in the order of dependencies to avoid foreign key errors
  await prisma.comment.deleteMany({});
  await prisma.post.deleteMany({});
  await prisma.topic.deleteMany({});
  await prisma.follow.deleteMany({});
  await prisma.message.deleteMany({});
  await prisma.chat.deleteMany({});
  await prisma.user.deleteMany({});

  console.log("All seed data deleted!");
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
*/