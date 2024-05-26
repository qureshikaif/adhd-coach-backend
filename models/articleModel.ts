import pool from "../db";
import { ArticleType } from "../types/ArticleType.ts";

export const createArticle = async (article: ArticleType) => {
  const { title, subtitle, tags, content, summary, adminId } = article;
  const result = await pool.query(
    "INSERT INTO articles (title, subtitle, tags, content, summary, admin_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
    [title, subtitle, tags, content, summary, adminId]
  );
  return result.rows[0];
};

export const getAllArticles = async () => {
  const result = await pool.query("SELECT * FROM articles");
  return result.rows;
};
