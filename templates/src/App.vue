<template>
    <div>
        <{{componentNamePascal}} />
    </div>
</template>

<script>
import {{componentNamePascal}} from './components/{{componentName}}.vue';

export default {
  components: {
    {{componentNamePascal}}
  }
};
</script>
