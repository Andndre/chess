import { build, emptyDir } from 'https://deno.land/x/dnt@0.28.0/mod.ts';

await emptyDir('./npm');

await build({
	entryPoints: ['./mod.ts'],
	outDir: './npm',
	shims: {
		// see JS docs for overview and more options
		deno: true,
	},
	package: {
		// package.json properties
		name: 'chess_typescript',
		version: Deno.args[0],
		description: 'Your package.',
		license: 'MIT',
		repository: {
			type: 'git',
			url: 'git+https://github.com/Andndre/chess.git',
		},
		bugs: {
			url: 'https://github.com/Andndre/chess/issues',
		},
	},
});

Deno.copyFileSync('README.md', 'npm/README.md');
