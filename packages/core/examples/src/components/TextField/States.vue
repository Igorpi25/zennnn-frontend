<template>
  <div class="grid sm:grid-cols-2 gap-x-4 gap-y-6">
    <TextField label="Default disabled" placeholder="Default disabled" disabled>
    </TextField>
    <TextField label="Default readonly" placeholder="Default readonly" readonly>
    </TextField>
    <TextField label="Dense disabled" placeholder="Dense disabled" disabled dense>
    </TextField>
    <TextField label="Dense readonly" placeholder="Dense readonly" readonly dense>
    </TextField>
    <TextField label="Single line disabled" placeholder="Single line disabled" disabled single-line>
    </TextField>
    <TextField label="Single line readonly" placeholder="Single line readonly" readonly single-line>
    </TextField>
    <TextField label="Solo disabled" placeholder="Solo disabled" disabled solo>
    </TextField>
    <TextField label="Solo readonly" placeholder="Solo readonly" readonly solo>
    </TextField>
  </div>
</template>
