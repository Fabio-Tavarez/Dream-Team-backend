const express = require("express");

const {
  getAllComments,
  getCommentById,
  deleteCommentById,
  createComment,
  updateCommentById,
  getAllCommentsOnTeamsId,
} = require("../queries/comments");

const router = express.Router({ mergeParams: true });

router.get("/", async (req, res) => {
  const allComments = await getAllComments(req.params.teamId);

  res.json(allComments);
});

router.get("/:commentId", async (req, res) => {
  try {
    const comment = await getCommentById(
      req.params.teamId,
      req.params.commentId
    );

    if (comment.length === 0) {
      throw {
        status: 404,
        message: "Review not found",
      };
    } else {
      return res.json(comment[0]);
    }
  } catch (error) {
    res.status(error.status).json({ error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  const deletedComment = await deleteCommentById(id);

  if (deletedComment.length === 0) {
    return res.status(404).json({ error: "Comment not found" });
  } else {
    return res.json(deletedComment[0]);
  }
});

router.post("/", async (req, res) => {
  const Comment = await createComment(req.body);

  res.json(Comment[0]);
});

router.put("/:id", async (req, res) => {
  const updatedComment = await updateCommentById(req.params.id, req.body);

  if (updatedComment.length === 0) {
    return res.status(404).json({ error: "Comment not found" });
  } else {
    return res.json(updatedComment[0]);
  }
});

router.get("/:teamId/get-all-comments", async (req, res) => {
  const { teamId } = req.params;

  try {
    const allCommentsById = await getAllCommentsOnTeamsId(teamId);

    if (allCommentsById.length === 0) {
      return res.status(404).json({ error: "Comment not found" });
    } else {
      console.log(allCommentsById);
      return res.json(allCommentsById);
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
