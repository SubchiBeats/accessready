# Contributing

Thanks for your interest in AccessReady.

## Development

```bash
npm install
npm run build
npm run dev
```

## Adding a rule

1. Add the rule metadata in `packages/core/src/rules.ts`.
2. Add detection logic in the relevant scanner.
3. Include clear `whyItMatters` and `howToFix` guidance.
4. Add or update a sample file that demonstrates the issue.
5. Add the rule to the README checklist if it is user-facing.

## Rule-writing style

- Be direct and practical.
- Avoid legal guarantees.
- Distinguish automated findings from manual checks.
- Provide examples when helpful.
- Use plain language suitable for communications teams.
