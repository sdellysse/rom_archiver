.PHONY: check
check:
	make install
	make style-check
	make lint-check

.PHONY: dev
dev:
	make install
	pnpm exec tsx --watch src/__entry.ts

.PHONY: lint-check
lint-check:
	make install
	pnpm exec eslint ./**/*.{ts,tsx} --quiet

.PHONY: lint-fix
lint-fix:
	make install
	pnpm exec eslint ./**/*.{ts,tsx} --fix

install: package.json pnpm-lock.yaml
	pnpm install

.PHONY: style-check
style-check:
	make install
	pnpm exec prettier ./**/*.{ts,tsx} --check

.PHONY: style-fix
style-fix:
	make install
	pnpm exec prettier ./**/*.{ts,tsx} --write

.PHONY: test
test:
	make install
	node --loader=tsx --test ./src/**.test.{ts,tsx}