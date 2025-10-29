import type { Collection } from "mongodb";

// 1Compter réactions et commentaires
export async function getPostsAggregated(
  postsCollection: Collection,
  commentsCollection: Collection,
  reactionsCollection: Collection
) {
  const pipeline = [
    {
      $lookup: {
        from: "reactions",
        localField: "_id",
        foreignField: "subjectId",
        as: "reactions"
      }
    },
    {
      $lookup: {
        from: "comments",
        localField: "_id",
        foreignField: "postId",
        as: "comments"
      }
    },
    {
      $addFields: {
        reactionsCount: { $size: "$reactions" },
        commentsCount: { $size: "$comments" }
      }
    },
    {
      $project: {
        content: 1,
        author: 1,
        createdAt: 1,
        updatedAt: 1,
        parentPostId: 1,
        reactionsCount: 1,
        commentsCount: 1
      }
    }
  ];

  return await postsCollection.aggregate(pipeline).toArray();
}

//post all comments
export async function getPostWithCommentsTree(
  postsCollection: Collection,
  commentsCollection: Collection,
  postId: string
) {
  const pipeline = [
    { $match: { _id: postId } },
    {
      $lookup: {
        from: "comments",
        localField: "_id",
        foreignField: "postId",
        as: "comments"
      }
    },
    {
      $unwind: {
        path: "$comments",
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $graphLookup: {
        from: "comments",
        startWith: "$comments._id",
        connectFromField: "_id",
        connectToField: "parentCommentId",
        as: "commentsTree"
      }
    },
    {
      $group: {
        _id: "$_id",
        content: { $first: "$content" },
        author: { $first: "$author" },
        createdAt: { $first: "$createdAt" },
        updatedAt: { $first: "$updatedAt" },
        parentPostId: { $first: "$parentPostId" },
        commentsTree: { $push: "$commentsTree" }
      }
    }
  ];

  const result = await postsCollection.aggregate(pipeline).toArray();
  return result[0] || null;
}

// posts top x reactions
export async function getTopPostsByReactions(
  postsCollection: Collection,
  reactionsCollection: Collection,
  topN = 5
) {
  const pipeline = [
    {
      $lookup: {
        from: "reactions",
        localField: "_id",
        foreignField: "subjectId",
        as: "reactions"
      }
    },
    {
      $addFields: {
        reactionsCount: { $size: "$reactions" }
      }
    },
    {
      $sort: { reactionsCount: -1 }
    },
    {
      $limit: topN
    },
    {
      $project: {
        content: 1,
        author: 1,
        reactionsCount: 1
      }
    }
  ];

  return await postsCollection.aggregate(pipeline).toArray();
}

// post x reactions ou plus
export async function getPopularPosts(
  postsCollection: Collection,
  reactionsCollection: Collection,
  minReactions = 3
) {
  const pipeline = [
    {
      $lookup: {
        from: "reactions",
        localField: "_id",
        foreignField: "subjectId",
        as: "reactions"
      }
    },
    {
      $addFields: {
        reactionsCount: { $size: "$reactions" }
      }
    },
    {
      $match: { reactionsCount: { $gte: minReactions } }
    },
    {
      $project: {
        content: 1,
        author: 1,
        reactionsCount: 1
      }
    }
  ];

  return await postsCollection.aggregate(pipeline).toArray();
}
