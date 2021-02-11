<template>
  <Image
    src="https://bad.src/not/valid"
    lazy-src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAARCAYAAADdRIy+AAAACXBIWXMAABCcAAAQnAEmzTo0AAACuklEQVQ4y12Ty3bTQAyG8yBx0sR3j+3x3U5aaOmitKVLOCxgy4F34Bze215I/FIcJ7DQ0Yxm9I0uo5XjONN2u52CIJhCSHAlvu/P2pvyPJ+6rp+yLJvSNJ2MMcvaZnbK0mzabDbTCkB2b3ZskoQTYxgXIBnntuQ0s2ywz3LLcOa6rrkoCq6qSrWItRb2Ss8B5JWzdsj19pTnGaVZTmXVUFnWVDcDFWVFtiipaXuytoC9JEAIQNVFUam9aRr45wQgrdZrhz3X4eNx4JfXN0RTcFnVXLcDdMMAct20SzQi5wjlDEAGkAGcI0TK+92GD4eBn54+chwngOZ6OY5jLUHddCiBXYAX+ElXZXmVMoA3qKGAXHfPYRgwGsFxFCnQmGSuK2qZpdgbhUhEZq65PJCgB1fAG32h6QZG3eCQ6x51hc41EtkXZQ3bCSaQZi5F27YKv6S83+PA8v3jM7+//8B93zEacIpkTk0hVbukLeddf+C26/h4e6fgfyKUS3EcMf4exwg/QsryqqQiqcs+DEOVa9v5+yxNWa/X7HmeAiUt6aDURR6SC2d9XosIqJwbIbBzQ+RsibBAVwUmDZHLEoVEKy+LTUScMU1qF4g8LPdkLT4LEKOHrgaYlghfaAtnTyfn1PVQAZKFAAQsaymHSY1GG5mYE2suKe9dlz99/sXffvzm7z//8MPzV667W35++8JZmgAaqeM5UlkPw4Dm9ZrVgCYObYMIT02h3W5H3fGR7h5eIK/U9O8whhYjd6AkiQkNIEBUEDEhYh01EaRLViRJTqMnQNSQwsAnz91RCCffcylODCEa6JSKasDaX8Bil1kWoMD9ALYwou1mS0tTjEl1WkxqNcXEZNgbraHUS7TWCyL/VurqolTiK4Isl384wjACOAI04vXR94NZ+6qRlmpARwBHOI6o/Si+/8tf9P378y8MWXEAAAAASUVORK5CYII="
    max-width="500"
    max-height="300"
  >
    <template v-slot:placeholder>
      <div class="flex items-center justify-center h-full">
        <Progress
          indeterminate
        ></Progress>
      </div>
    </template>
  </Image>
</template>