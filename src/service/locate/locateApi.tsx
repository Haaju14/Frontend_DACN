import { httpClient } from "../../util/util";

export class LocateApi {
  async getLocate() {
    try {
      const res = await httpClient.get("/api/vi-tri");
      return res.data.content;
    } catch (error) {}
  }

  async postLocateImage(formFile: File, maViTri: string) {
    const formData = new FormData();
    formData.append("formFile", formFile);

    try {
      const res = await httpClient.post(
        `/api/vi-tri/upload-hinh-vitri?maViTri=${maViTri}`,
        formData
      );

      return res.data;
    } catch (error) {}
  }

  async postLocate(locateData: object) {
    try {
      const res = await httpClient.post("/api/vi-tri", locateData);
      return res.data;
    } catch (error) {}
  }

  async getLocateById(id: string) {
    try {
      const res = await httpClient.get(`/api/vi-tri/${id}`);
      return res.data;
    } catch (error) {
      throw error;
    }
  }

  async updateLocate(locateData: object, id: string) {
    try {
      const res = await httpClient.put(`/api/vi-tri/${id}`, locateData);
      return res.data;
    } catch (error) {}
  }

  async deleteLocate(id: string) {
    try {
      const res = await httpClient.delete(`/api/vi-tri/${id}`);
      return res.data;
    } catch (error) {
      console.log("error: ", error);
    }
  }
}

export const locateApi = new LocateApi();
