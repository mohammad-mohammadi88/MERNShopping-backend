export default (file: { name: string }): string =>
    decodeURIComponent(file.name);
