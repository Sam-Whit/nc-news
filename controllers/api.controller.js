exports.getAllEndPoints = (req, res, next) => {
  const endPoints = {
    msg: "available endpoints",
    "GET /api/topics": {
      description: "Returns an array of all topics",
      exampleResponse: [
        { description: "Code is love, code is life", slug: "coding" },
        { description: "FOOTIE!", slug: "football" },
        {
          description: "Hey good looking, what you got cooking?",
          slug: "cooking",
        },
      ],
    },
    "GET /api/articles": {
      description: "Returns an array of all articles",
      availableQueries: ["topic", "sort_by", "order"],
      exampleResponse: [
        {
          article_id: 3,
          title: "Seafood substitutions are increasing",
          votes: 100,
          topic: "cooking",
          author: "weegembump",
          created_at: 1527695953341,
          comment_count: 11,
        },
        {
          title:
            "The Rise Of Thinking Machines: How IBM's Watson Takes On The World",
          votes: 25,
          topic: "coding",
          author: "jessjelly",
          created_at: 1589418120000,
          comment_count: 33,
        },
      ],
    },
    "GET /api/articles/:article_id": {
      description: "Returns a specific article based on assigned unique id",
      exampleResponse: {
        article_id: 3,
        title: "Seafood substitutions are increasing",
        votes: 100,
        topic: "cooking",
        author: "weegembump",
        body: "Text from the article..",
        created_at: 1527695953341,
        comment_count: 11,
      },
    },
    "PATCH /api/articles/:article_id": {
      description: "Allows you to update the votes asscoiated with an article",
      exampleResponse: "(The updated article with a new vote count)",
    },
    "GET /api/articles/:article_id/comments": {
      description: "returns an array of comments for the given `article_id`",
      exampleResponse: [
        {
          comment_id: 1,
          body: "Explicabo perspiciatis voluptatem sunt tenetur maxime aut. Optio totam modi. Perspiciatis et quia.",
          votes: 4,
          author: "cooljmessy",
          article_id: 1,
          created_at: 1577827260000,
        },
        {
          comment_id: 2,
          body: "Sit sequi odio suscipit. Iure quisquam qui alias distinctio eos officia enim aut sit. Corrupti ut praesentium ut iste earum itaque qui. Dolores in ab rerum consequuntur. Id ab aliquid autem dolore.",
          votes: 11,
          author: "weegembump",
          article_id: 1,
          created_at: 1601140560000,
        },
      ],
    },
    "POST /api/articles/:article_id/comments": {
      description: "Allows you to post a comment from an accepted username",
      exampleResponse: {
        username: "icellusedkars",
        body: "enjoying the project's progress",
      },
    },
    "DELETE /api/comments/:comment_id": {
      description: "Allows you to delete a comment",
    },
    "GET /api/users": {
      description: "Returns an array of all users",
    },
    "GET GET /api/users/:username": {
      description: "Responds with a specific user object",
      exampleResponse: {
        username: "icellusedkars",
        name: "sam",
        avatar_url:
          "https://avatars2.githubusercontent.com/u/24604688?s=460&v=4",
      },
    },
  };
  res.status(200).send(endPoints).catch(next);
};
