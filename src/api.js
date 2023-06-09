import axios from "axios";

const token = "eyJhbGciOiJIUzI1NiJ9.eyJleHAiOjE2NTAyOTIxMjEsIkFwcGxpY2F0aW9uIjoiUnVrb3ZvZGl0ZWwifQ.tdUIEg-hrhP2dRQHL1r6x3raC2GZ8qu0utwrTC8zUBk";

const instance = axios.create({
    baseURL: `https://portal.liloo.by/api/integrations/services/distributor/tradeics`,
    headers: {
        Authorization : `Bearer ${token}`,
    },
});

instance.interceptors.response.use(
    (response) => response.data,
    (error) => ({ error: error.response.data }),
);

export const reserveItemInfo = async (params) => {
    const data = await instance.post("/reserve_item_info", { ...params, "document_id": "0000586175" });
    return data;
};

export const updateItems = async (params) => {
    const data = await instance.post("/update_reserve_item", { ...params });
    return data;
};

export const removeItem = async (params) => {
    const data = await instance.post("/remove_reserve_item", { ...params });
    return data;
};