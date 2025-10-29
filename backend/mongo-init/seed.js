function uuidv4() {
    const hex = (n) =>
      Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    return (
      hex() + hex() + "-" + hex() + "-" + hex() + "-" + hex() + "-" + hex() + hex() + hex()
    );
  }
  
  db = db.getSiblingDB("socialdb");
  
  const now = new Date();
  
  // posts
  const post1 = {
    _id: uuidv4(),
    authorId: uuidv4(),
    author: { pseudonym: "Onyyx" },
    content: { text: "Behold, the loaf.", media: [] },
    createdAt: now,
    updatedAt: now,
    parentPostId: null
  };
  
  const post2 = {
    _id: uuidv4(),
    authorId: uuidv4(),
    author: { pseudonym: "tartines" },
    content: { text: "Such a soft loaf.", media: [] },
    createdAt: now,
    updatedAt: now,
    parentPostId: post1._id
  };
  
  db.posts.insertMany([post1, post2]);
  
  // comments
  const comment1 = {
    _id: uuidv4(),
    postId: post1._id,
    authorId: uuidv4(),
    author: { pseudonym: "Inès" },
    content: { text: "Regal." },
    createdAt: now,
    parentCommentId: null,
    path: []
  };
  
  const comment2 = {
    _id: uuidv4(),
    postId: post1._id,
    authorId: uuidv4(),
    author: { pseudonym: "Onyyx" },
    content: { text: "Indeed, most regal." },
    createdAt: now,
    parentCommentId: comment1._id,
    path: [comment1._id]
  };
  
  db.comments.insertMany([comment1, comment2]);
  
  // reactions
  db.reactions.insertMany([
    {
      _id: uuidv4(),
      subjectType: "post",
      subjectId: post1._id,
      userId: post2.authorId,
      kind: "like",
      createdAt: now
    },
    {
      _id: uuidv4(),
      subjectType: "comment",
      subjectId: comment1._id,
      userId: post1.authorId,
      kind: "purr",
      createdAt: now
    }
  ]);
  
  print("✅ MongoDB seed completed successfully!");
  