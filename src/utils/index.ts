


export function createPageUrl(pageName: string) {
    // Keep route casing aligned to the defined routes (e.g., /Gameplay, /Home)
    return '/' + pageName.replace(/ /g, '');
}
