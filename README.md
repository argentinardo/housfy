# Misión Rover en Marte para Housfy de Damián Nardini

Este proyecto simula un rover en Marte que puede moverse y detectar obstáculos. El rover recibe comandos desde la Tierra y los ejecuta, moviéndose por la superficie marciana.

## Características

- El rover tiene una posición inicial (x,y) y una dirección (N,S,E,W).
- El rover puede recibir secuencias de comandos como "FFRLF".
- Los comandos disponibles son:
  - F: Mover hacia adelante
  - L: Girar a la izquierda (90 grados)
  - R: Girar a la derecha (90 grados)
- El planeta es cuadrado (20x20).
- Hay detección de obstáculos - si el rover encuentra un obstáculo, se detiene antes de chocar y reporta la posición del obstáculo.
- También se detendrá al alcanzar los bordes de la grilla.

## Implementación Técnica

El proyecto está implementado utilizando:

- TypeScript para la lógica del rover
- Svelte para la interfaz de usuario
- Vitest para las pruebas unitarias //WIP
- Tailwind CSS para los estilos

## Instalación

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

## Uso

1. La interfaz muestra una cuadrícula que representa la totalidad de la superficie marciana (20x20).
2. El rover se representa como un icono con una flecha que apunta en la dirección actual.
3. Se pueden añadir obstáculos aleatorios representados por iconos de advertencia.
4. Ingrese comandos en el campo de texto y presione "Enviar" para que el rover los ejecute.
5. El rover reportará el éxito de la misión o informará sobre cualquier obstáculo encontrado.