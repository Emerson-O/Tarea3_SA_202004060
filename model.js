const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

// Conectar a MySQL
const sequelize = new Sequelize(
  process.env.DB_NAME,       // base de datos
  process.env.DB_USER,       // usuario
  process.env.DB_PASSWORD,   // contraseña
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: process.env.DB_DIALECT,
    logging: false,
  }
);

// Definir el modelo CI (Elemento de Configuración)
const CI = sequelize.define('CI', {
  nombre_ci: {
    type: DataTypes.STRING,
    allowNull: false
  },
  tipo_ci: {
    type: DataTypes.STRING,
    allowNull: false
  },
  descripcion: {
    type: DataTypes.TEXT,
  },
  numero_serie: {
    type: DataTypes.STRING,
  },
  version: {
    type: DataTypes.STRING,
  },
  Fecha_adquisicion: {
    type: DataTypes.DATE,
  },
  Estado: {
    type: DataTypes.STRING,
  },
  propietario: {
    type: DataTypes.STRING,
  },
  Fecha_cambio: {
    type: DataTypes.DATE,
  },
  descripcion_cambio: {
    type: DataTypes.TEXT,
  },
  documentacion: {
    type: DataTypes.TEXT,
  },
  enlaces_incidentes: {
    type: DataTypes.TEXT,
  },
  niveles_seguridad: {
    type: DataTypes.STRING,
  },
  cumplimiento: {
    type: DataTypes.STRING,
  },
  numero_licencia: {
    type: DataTypes.STRING,
  },
  fecha_vencimiento: {
    type: DataTypes.DATE,
  },
  sistema_operativo: {
    type: DataTypes.STRING,
  },
  ip_servidor: {
    type: DataTypes.STRING,
  },
  // Agregar el campo ambiente
  ambiente: {
    type: DataTypes.ENUM('DEV', 'QA', 'PROD'), // Asegúrate de que los valores sean limitados a los tres entornos
    allowNull: false
  }
}, {
  timestamps: false,
  tableName: 'CI' // Nombre de la tabla en la base de datos
});


// Definir el modelo CI_Cambios (Historial de cambios de los CIs)
const CI_Cambios = sequelize.define('CI_Cambios', {
  ci_id: {
    type: DataTypes.INTEGER,
    references: {
      model: CI,
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  descripcion_cambio: {
    type: DataTypes.TEXT,
  }
}, {
  timestamps: false
});

// Definir el modelo Relaciones (Relaciones entre CIs)
const Relaciones = sequelize.define('Relaciones', {
  ci_id_destino: {
    type: DataTypes.INTEGER,
    references: {
      model: CI,
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  tipo_relacion: {
    type: DataTypes.STRING,
  }
}, {
  timestamps: false
});

// Relacionar las tablas (definición de las relaciones en Sequelize)
CI.hasMany(CI_Cambios, { foreignKey: 'ci_id' });
CI.hasMany(Relaciones, { foreignKey: 'ci_id_destino' });

module.exports = { sequelize, CI, CI_Cambios, Relaciones };
