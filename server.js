const app = require('./app'); // Importa tu instancia de express desde app.js

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server ejecutandose en el puerto ${PORT}`);
});

