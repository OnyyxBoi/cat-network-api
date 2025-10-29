db = db.getSiblingDB("socialdb");

const now = new Date();

// IDs fixes
const user1Id = "11111111-1111-1111-1111-111111111111";
const user2Id = "22222222-2222-2222-2222-222222222222";

const post1Id = "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa";
const post2Id = "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb";

const comment1Id = "cccccccc-cccc-cccc-cccc-cccccccccccc";
const comment2Id = "dddddddd-dddd-dddd-dddd-dddddddddddd";

// posts
const post1 = {
  _id: post1Id,
  authorId: user1Id,
  author: { pseudonym: "Onyyx" },
  content: { text: "Behold, the loaf.", media: [] },
  createdAt: now,
  updatedAt: now,
  parentPostId: null
};

const post2 = {
  _id: post2Id,
  authorId: user2Id,
  author: { pseudonym: "tartines" },
  content: { text: "Such a soft loaf.", media: [] },
  createdAt: now,
  updatedAt: now,
  parentPostId: post1Id
};

db.posts.insertMany([post1, post2]);

// comments
const comment1 = {
  _id: comment1Id,
  postId: post1Id,
  authorId: user2Id,
  author: { pseudonym: "tartines" },
  content: { text: "Regal." },
  createdAt: now,
  parentCommentId: null,
  path: []
};

const comment2 = {
  _id: comment2Id,
  postId: post1Id,
  authorId: user1Id,
  author: { pseudonym: "Onyyx" },
  content: { text: "Indeed, most regal." },
  createdAt: now,
  parentCommentId: comment1Id,
  path: [comment1Id]
};

db.comments.insertMany([comment1, comment2]);

// reactions
db.reactions.insertMany([
  {
    _id: "eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee",
    subjectType: "post",
    subjectId: post1Id,
    userId: user2Id,
    kind: "like",
    createdAt: now
  },
  {
    _id: "ffffffff-ffff-ffff-ffff-ffffffffffff",
    subjectType: "comment",
    subjectId: comment1Id,
    userId: user1Id,
    kind: "purr",
    createdAt: now
  }
]);

print("MongoDB seed completed successfully ! ");
