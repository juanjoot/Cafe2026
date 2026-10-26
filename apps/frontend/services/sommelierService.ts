interface Preferences {
  query: string;
}

export const getRecommendations = async (preferences: Preferences) => {
  // Aquí puedes poner la llamada real a tu API/AI:
  // Por ahora simula una respuesta:
  return {
    recommendation: `Te sugerimos un café con perfil: ${preferences.query}.`
  };
};
