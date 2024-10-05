import { httpClient } from "../../util/util";

export class CommentApi {
  async getCommentByMaPhong(maPhong: string) {
    if (maPhong === "") return [];
    try {
      const res = await httpClient.get(
        `/api/binh-luan/lay-binh-luan-theo-phong/${maPhong}`
      );
      return res.data.content;
    } catch (error) {}
  }

  async addComment(commentData: object) {
    try {
      const res = await httpClient.post("/api/binh-luan", commentData);
      return res;
    } catch (error) {
      console.log("error: ", error);
    }
  }

  async getComment() {
    try {
      const res = await httpClient.get("/api/binh-luan");
      return res.data.content;
    } catch (error) {}
  }
}

export const commentApi = new CommentApi();
