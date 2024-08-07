const radicalKeys = " cohbiugqdtpxszwfelmknr";
const typeKeys = " VPMT";

const types = ["radical", "verb", "place", "person", "noun"];

// TODO add the missing words and their synonyms
/**
 * @see "https://github.com/leo3065/Devotee-Plus/blob/main/image/glyph-table.png"
 */
const words = [
    [ // ""
        [], // ""
        "closed", // c
        "opened", // o
        "help", // h
        ["portal", "passage", "doorway", "way", "road", "street", "strip"], // p
        "self", // i
        "apart", // u
        ["moving", "trip", "flight", "going", "coming"], // g
        ["greetings", "greeting", "hi", "hello", "bye", "goodbye"], // q
        "god", // d
        [], // t
        [], // p
        [], // x
        [], // s
        {singular: ["up", "top", "great"], plural: ["tower"]}, // z
        [], // w
        [], // f
        [], // e
        [], // l
        [], // m
        [], // k
        ["not", "don't", "no", "cannot"], // n
        ["free"], // r
    ],
    [ // V
        [],
        "close",
        "open",
        "help",
        "traverse",
        "be",
        ["split", "break"],
        ["go", "pass", "drive", "move", "attend"],
        ["greet", "welcome", "salute"],
        "bless",
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        ["see", "sees", "watch", "watches"]
    ],
    [ // P
        "place",
        "warehouse",
        "park",
        ["hospital", "laboratory", "lab"],
        ["port", "terminal", "airport", "station"],
        "home",
        ["house", "residence", "pension", "mansion"],
        ["transport", "train", "airplane", "vehicle", "car", "bus", "metro"],
        ["party", "meeting", "conference", "launge", "service"],
        ["church", "temple", "sinagogue"],
    ],
    [ // M
        {singular: ["man", "human", "person"], plural: ["men", "people"], super: ["peoples"]},
        ["guard", "shy", "recluse", "introvert", "quiet", "spouse", "wife", "husband"],
        ["explorer", "sympathetic", "extrovert", "talkative"],
        ["doctor", "scientist", "helper", "assistant", "healer"],
        ["traveler", "nomad", "mover", "scout"],
        {singular: ["I", "me", "myself"], plural: ["we", "us", "ourselves"]},
        {singular: ["you", "yourself"], plural: ["yourselves"]},
        ["mover", "goer", "driver", "pilot", "racer"],
        ["receptionist", "host", "attendant", "peers"],
        ["devotee", "faithful", "religious"],
    ],
    [ // T
        ["thing", "thingy", "trinket", "stuff"],
        ["seal", "sealant", "glue", "seal", "binder", "restrainer", "cuffs", "handcuffs", "chain"],
        ["key", "opener", "crowbar", "drill"],
        ["potion", "medicine", "formula", "vitamin"],
        ["door", "gate"],
        ["my", "mine"],
        "your",
        ["shoe", "cloth", "hat"],
        ["card", "invite", "invitation", "id", "identification", "document"],
        ["bible", "cross", "scripture", "book"],
    ],
];

const dict = Object.assign({}, typeKeys.split("").reduce((obj, type, i) => {
    const typeName = types[i];
    obj[typeName] = words[i].map((words, j) => {
        const base = {
            singular: [],
            plural: [],
            super: [],
            symbol: (() => {
                return `${typeKeys[i]}${radicalKeys[j]}`.trimStart();
            })()
        };

        if (typeof words === 'string') {
            words = [words];
        }

        if (Array.isArray(words)) {
            words = {singular: words};
        }

        const entry = Object.assign({}, base, words);
        entry.singular = entry.singular.map(strToLower);
        entry.plural = entry.plural.map(strToLower);
        entry.super = entry.super.map(strToLower);

        return entry;
    });

    return obj;
}, {}));

function notNull(item) {
    return null !== item && typeof item !== 'undefined';
}

function strToLower(item) {
    return item.toLowerCase();
}

function lookUp(word, prioritizeVerbs = true) {
    word = word.toLowerCase().replace(/[^a-z]/g, '');

    let searchOrder = [...types];
    if (prioritizeVerbs) {
        searchOrder.unshift("verb");
    }

    return searchOrder.map(type => {
        const result = {
            type,
            symbol: dict[type].map(from => {
                const isSingular = from.singular.includes(word);

                const isPlural = (
                    from.plural.includes(word)
                    || (!isSingular && (
                        from.singular.includes(word.replace(/s$/, '')
                        || from.singular.includes(word.replace(/es$/, '')
                    ))))
                );

                const isSuper = from.super.includes(word);

                if (isSuper) {
                    return from.symbol.repeat(3);
                }

                if (isPlural) {
                    return from.symbol.repeat(2);
                }

                if (isSingular) {
                    return from.symbol;
                }

                return null;
            }).find(notNull),
        };

        if (!result.symbol) return null;

        return result;
    }).find(notNull) ?? {};
}

export default class Glyphs {
    static #defaultParseOptions = {
        strip: false,
    }

    static parse(text, options = {}) {
        options = Object.assign({}, this.#defaultParseOptions, options ?? {});

        return this.#traverseAndReplace(text, true, options.strip);
    }

    static strip(text) {
        return this.#traverseAndReplace(text, false);
    }

    static #traverseAndReplace(text, makeSymbols = true, strip = true) {
        if (!makeSymbols) strip = true;

        return text
            .split("\n")
            .map(line => {
                let foundVerb = false;
                return line
                    .split(' ')
                    .map(word => {
                        const {type, symbol} = lookUp(word, !foundVerb);
                        foundVerb = foundVerb || type === 'verb';

                        if (!symbol) {
                            if (strip) return null;
                            return word;
                        }

                        if (!makeSymbols) {
                            return word;
                        }

                        return symbol;
                    })
                    .filter(notNull)
                    .join(makeSymbols ? '' : ' ');
            })
            .join("\n");
    }
}
