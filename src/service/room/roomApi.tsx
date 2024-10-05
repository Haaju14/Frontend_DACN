import { httpClient } from "../../util/util";

export class RoomApi {
  async getRoom() {
    try {
      const res = await httpClient.get("/api/phong-thue");
      return res.data.content;
    } catch (error) {}
  }

  async getRoomByID(id: string) {
    try {
      const res = await httpClient.get(`/api/phong-thue/${id}`);
      return res.data.content;
    } catch (error) {}
  }

  async getRoomByMaViTri(maViTri: string) {
    try {
      const res = await httpClient.get(
        `api/phong-thue/lay-phong-theo-vi-tri?maViTri=${maViTri}`
      );
      return res.data.content;
    } catch (error) {}
  }

  async addBookingRoom(bookingRoom: object) {
    try {
      const res = await httpClient.post("/api/dat-phong", bookingRoom);
      return res;
    } catch (error) {}
  }

  async updateBookingRoom(bookingRoom: object, maDatPhong: string) {
    try {
      const res = await httpClient.put(
        `/api/dat-phong/${maDatPhong}`,
        bookingRoom
      );
      return res;
    } catch (error) {}
  }

  async getBookingRoomByUser(maNguoiDung: string) {
    try {
      const res = await httpClient.get(
        `/api/dat-phong/lay-theo-nguoi-dung/${maNguoiDung}`
      );

      return res.data.content;
    } catch (error) {}
  }

  async getBookingRoom() {
    try {
      const res = await httpClient.get("/api/dat-phong");
      return res.data.content;
    } catch (error) {}
  }

  async getBookingRoomByID(id: string) {
    try {
      const res = await httpClient.get(`/api/dat-phong/${id}`);
      return res.data.content;
    } catch (error) {}
  }

  async postRoomImage(formFile: File, maPhong: string) {
    const formData = new FormData();
    formData.append("formFile", formFile);

    try {
      const res = await httpClient.post(
        `/api/phong-thue/upload-hinh-phong?maViTri=${maPhong}`,
        formData
      );

      return res.data;
    } catch (error) {}
  }

  async postRoom(roomData: object) {
    try {
      const res = await httpClient.post("/api/phong-thue", roomData);
      return res.data;
    } catch (error) {}
  }

  async getRoomById(id: string) {
    try {
      const res = await httpClient.get(`/api/phong-thue/${id}`);
      return res.data;
    } catch (error) {
      throw error;
    }
  }

  async updateRoom(roomData: object, id: string) {
    try {
      const res = await httpClient.put(`/api/phong-thue/${id}`, roomData);
      return res.data;
    } catch (error) {}
  }

  async deleteRoom(id: string) {
    try {
      const res = await httpClient.delete(`/api/phong-thue/${id}`);
      return res.data;
    } catch (error) {}
  }
}

export const roomApi = new RoomApi();
