<div class="panel">
  <h2 class="panel-title">Instrucciones</h2>
  <ul class="instructions-list">
    <li>Ingresa comandos para controlar el rover.</li>
    <li>El rover se mueve en un planeta cuadrado de 20x20.</li>
    <li>
      <span class="command-key">F</span>: Mover hacia adelante en la dirección
      actual.
    </li>
    <li><span class="command-key">L</span>: Girar 90° a la izquierda.</li>
    <li><span class="command-key">R</span>: Girar 90° a la derecha.</li>
    <li>
      Puede ejecutar la cadena de comando apretando el botón o con la tecla
      enter de su teclado
    </li>
    <li>Si el rover encuentra un obstáculo, se detendrá antes de chocar.</li>
    <li>
      Si el rover llega al límite de la grilla, se detendrá y no traspasará la
      frontera.
    </li>
    <li>
      Puede agregar obstáculos desde el panel de obstaculos, si presiona
      eliminar, borrara todos los obstaculos de la grilla.
    </li>
    <li>
      Solo podrá ingresar los comandos "F", "R", "L" , las demás teclas no son
      admitidas.
    </li>
  </ul>
</div>

<style>
  .panel {
    background-color: var(--panel-bg, white);
    padding: 16px;
    border-radius: 8px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    color: #6c7e89;
    margin-top: 1rem;
    width: 100%;
  }

  .panel-title {
    font-size: 20px;
    font-weight: 600;
    margin-bottom: 12px;
    display: flex;
    align-items: center;
    color: #000;
  }

  .command-key {
    background-color: #f1f5f9;
    border: 1px solid #cbd5e1;
    border-radius: 4px;
    padding: 2px 6px;
    margin: 0 2px;
    font-family: monospace;
    font-weight: bold;
  }

  .instructions-list {
    list-style-type: disc;
    padding-left: 1.25rem;
  }

  .instructions-list li {
    margin-bottom: 0.25rem;
  }
</style>
