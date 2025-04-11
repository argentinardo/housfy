<script lang="ts">
  import { showErrorAlert as showError } from "../utils/simpleAlertUtils";
  export let commands: string = "";
  
  export let onExecuteCommands: () => void;
  
  function validateCommands(input: string): string {
    const upperInput = input.toUpperCase();
    
    const validChars = ['F', 'L', 'R'];
    const invalidChars = upperInput.split('').filter(char => !validChars.includes(char));
    
    if (invalidChars.length > 0) {
      const uniqueInvalidChars = [...new Set(invalidChars)].join(', ');
      showError(`Comando inválido: "${uniqueInvalidChars}" no es un comando válido. Solo se permiten F, L, R.`);
    }
    
    return upperInput.split('').filter(char => validChars.includes(char)).join('');
  }

  function handleCommandInput(event: Event) {
    const input = (event.target as HTMLInputElement).value;
    const oldCommands = commands;
    commands = validateCommands(input);
    
    if (commands !== input.toUpperCase()) {
      (event.target as HTMLInputElement).value = commands;
    }
  }

  function handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      onExecuteCommands();
    }
  }
</script>

<div class="panel">
  <h2 class="panel-title">Comandos</h2>
  <p class="mb-2 text-sm">
    F: Avanzar, L: Girar izquierda, R: Girar derecha
  </p>
  <div class="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
    <input
      type="text"
      bind:value={commands}
      on:input={handleCommandInput}
      on:keydown={handleKeyDown}
      placeholder="Ej: FFRLF"
      class="input-command"
      maxlength="50"
    />
    <button
      on:click={onExecuteCommands}
      class="btn {commands ? 'btn-green hover:bg-green-600' : 'bg-gray-400 text-white'}"
      aria-label="Ejecutar comandos"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="icon"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z"
        />
      </svg>
    </button>
  </div>
</div>

<style>
  .panel {
    background-color: var(--panel-bg, white);
    padding: 16px;
    border-radius: 8px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    color: #6c7e89;
    margin-bottom: 16px;
  }

  .panel-title {
    font-size: 20px;
    font-weight: 600;
    margin-bottom: 12px;
    display: flex;
    align-items: center;
    color: #000;
  }

  .icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    margin-right: 0;
  }

  .btn {
    padding: 8px 16px;
    border-radius: 4px;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .btn-green {
    background-color: var(--green-color, hsl(120, 100%, 35%));
    color: white;
  }
  
  .input-command {
    flex: 1;
    padding: 0.5rem;
    border: 1px solid #e2e8f0;
    border-radius: 0.25rem;
    font-size: 1.25rem;
    font-weight: bold;
    letter-spacing: 0.1em;
    font-family: monospace;
    text-transform: uppercase;
  }
  
  .input-command::placeholder {
    font-weight: normal;
    font-family: sans-serif;
    font-size: 1rem;
    letter-spacing: normal;
  }
  
  /* Clases de Tailwind replicadas */
  .flex {
    display: flex;
  }
  
  .flex-col {
    flex-direction: column;
  }
  
  .mb-2 {
    margin-bottom: 0.5rem;
  }
  
  .text-sm {
    font-size: 0.875rem;
  }
  
  .space-y-2 > * + * {
    margin-top: 0.5rem;
  }
  
  @media (min-width: 768px) {
    .md\:flex-row {
      flex-direction: row;
    }
    
    .md\:space-y-0 > * + * {
      margin-top: 0;
    }
    
    .md\:space-x-2 > * + * {
      margin-left: 0.5rem;
    }
  }
</style> 