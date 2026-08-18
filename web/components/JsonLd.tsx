/**
 * Emits a JSON-LD block.
 *
 * `JSON.stringify` is what makes `dangerouslySetInnerHTML` safe here — the value
 * is serialised data, never markup — but a string containing `</script>` would
 * still break out of the tag, so the closing bracket is escaped.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  const json = JSON.stringify(data).replace(/</g, '\\u003c');
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
