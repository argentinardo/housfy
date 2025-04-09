# Misión Rover en Marte

Este proyecto simula un rover en Marte que puede moverse y detectar obstáculos. El rover recibe comandos desde la Tierra y los ejecuta, moviéndose por la superficie marciana.

## Características

- El rover tiene una posición inicial (x,y) y una dirección (N,S,E,W).
- El rover puede recibir secuencias de comandos como "FFRLF".
- Los comandos disponibles son:
  - F: Mover hacia adelante
  - L: Girar a la izquierda (90 grados)
  - R: Girar a la derecha (90 grados)
- El planeta es cuadrado (20x20) y los bordes son envolventes.
- Hay detección de obstáculos - si el rover encuentra un obstáculo, se detiene antes de chocar y reporta la posición del obstáculo.

## Implementación Técnica

El proyecto está implementado utilizando:

- TypeScript para la lógica del rover
- Svelte para la interfaz de usuario
- Vitest para las pruebas unitarias
- Tailwind CSS para los estilos

## Estructura del Proyecto

- `src/lib/rover/Rover.ts`: Implementación de la lógica del rover
- `src/lib/rover/RoverUI.svelte`: Componente para la interfaz de usuario
- `src/lib/rover/Rover.test.ts`: Pruebas unitarias

## Instalación

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Ejecutar pruebas
npm run test
```

## Uso

1. La interfaz muestra una cuadrícula que representa la totalidad de la superficie marciana (20x20).
2. El rover se representa como un icono con una flecha que apunta en la dirección actual.
3. Se pueden añadir obstáculos aleatorios representados por iconos de advertencia.
4. Ingrese comandos en el campo de texto y presione "Enviar" para que el rover los ejecute.
5. El rover reportará el éxito de la misión o informará sobre cualquier obstáculo encontrado.

## Diseño

- Clase `Rover`: Encapsula toda la lógica del rover, incluyendo movimiento, giros y detección de obstáculos.
- Interfaz MoveResult: Proporciona información sobre el resultado de los movimientos.
- La superficie es tratada como un "toro" matemático, donde los bordes están conectados.

## Pruebas

Se han implementado pruebas unitarias exhaustivas para asegurar que:
- El rover se mueve correctamente en todas las direcciones
- Los giros funcionan como se espera
- La detección de obstáculos previene colisiones
- Los bordes del planeta se comportan correctamente
- El rover maneja adecuadamente los comandos inválidos
