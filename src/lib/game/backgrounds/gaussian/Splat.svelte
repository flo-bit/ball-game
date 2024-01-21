<script lang="ts">
    import LumaSplats from './LumaSplatsThree/LumaSplatsThree.svelte'
  
    // <LumaSplatsThree> 
    let lumaSplatsMode: 'object' | 'object-env' | 'env' = 'object-env'
  </script>
  
  <LumaSplats
    visible={true}
    scale={30}
    source="https://lumalabs.ai/capture/4da7cf32-865a-4515-8cb9-9dfc574c90c2"
    mode={lumaSplatsMode}
  />
  