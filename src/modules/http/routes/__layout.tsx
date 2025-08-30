export const RootLayout = (props: {
  title: string;
  nodeEnv: string;
  children: unknown;
}) => {
  // Right here I would like to reach out to Nest's dependency injection system, and get a service
  const { title, children } = props;
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{title}</title>
        <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
        {props.nodeEnv !== "production" && (
          <>
            <script
              src="https://cdn.jsdelivr.net/npm/htmx.org@2.0.6/dist/htmx.js"
              integrity="sha384-ksKjJrwjL5VxqAkAZAVOPXvMkwAykMaNYegdixAESVr+KqLkKE8XBDoZuwyWVUDv"
              crossorigin="anonymous"
            ></script>
            <script src="https://unpkg.com/hyperscript.org@0.9.14"></script>
          </>
        )}
      </head>
      <body>
        <script src="/main.js"></script>
        {children}
      </body>
    </html>
  );
};
