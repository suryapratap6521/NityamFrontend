export const handleResponse = async (response) => {
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Something went wrong");
    }
    return response.json();
  };
  