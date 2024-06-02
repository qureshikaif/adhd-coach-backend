import pool from "../db";
import { ArticleType } from "../types/ArticleType";
import express from "express";

export const createArticle = async (article: ArticleType) => {
  const { title, subtitle, tags, content, summary } = article;
  const result = await pool.query(
    "INSERT INTO articles (title, subtitle, tags, content, summary) VALUES ($1, $2, $3, $4, $5) RETURNING *",
    [title, subtitle, tags, content, summary]
  );
  return result.rows[0];
};

export const getAllArticles = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const result = await pool.query("SELECT * FROM articles");
    return res.status(200).json(result.rows);
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};
