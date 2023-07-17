export const getHeaders = (q) => {
    return {
      headers: {
        Authorization: `Token ${q}`,
      },
    };
  };
  