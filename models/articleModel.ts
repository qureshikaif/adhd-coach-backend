import pool from "../db";
import { ArticleType } from "../types/ArticleType";

export const createArticle = async (article: ArticleType) => {
  const { title, subtitle, tags, content, summary } = article;
  const result = await pool.query(
    "INSERT INTO articles (title, subtitle, tags, content, summary) VALUES ($1, $2, $3, $4, $5) RETURNING *",
    [title, subtitle, tags, content, summary]
  );
  return result.rows[0];
};

export const getAllArticles = async () => {
  const result = await pool.query("SELECT * FROM articles");
  return result.rows;
};
