# Adding an update to Through the Grapevine

Ken — here's how to put a new update on the site. It's two steps and takes about
ten minutes. Everything happens on GitHub in your web browser. There's nothing to
install and nothing to set up.

## First, upload your photos

Open the `images` folder, click **Add file** and then **Upload files**, drag your
photos in, and click **Commit changes** at the bottom of the page.

Before you upload, give each photo a plain name with dashes instead of spaces —
`harvest-morning.jpg` rather than `harvest morning.jpg` or `IMG_4471.JPG`. Then
write the names down exactly as you typed them, capital letters and all. You'll
need them again in a minute and they have to match letter for letter.

## Then, write the update

Open the file called `posts.js` and click the pencil icon in the top right to edit
it.

At the bottom of that file you'll find a blank update between two dashed lines.
Copy it, paste it in near the top just under the line that says `const posts = [`,
and fill in the four blanks:

```js
    {
        title: "Veraison Came Early This Year",

        date: "2026-08-14",

        photos: [
            "harvest-morning.jpg",
            "new-trellis-posts.jpg"
        ],

        body: [
            "The first paragraph of your update goes here.",
            "And a second one, if you want it."
        ]
    },
```

The title is your headline. The date is written year-month-day, so the example
above is the 14th of August 2026 — the site turns that into "August 14, 2026" on
its own. The photos are the file names from the first step. The body is your
writing, one paragraph per line.

Click **Commit changes** when you're done. Give it about a minute, then refresh
the page and your update will be there.

## A few things you don't need to worry about

You can paste your new update anywhere in the list. They sort themselves so the
newest one is always at the top.

You can use as many photos as you like. One fills the width, two sit side by side,
four make a square, and it keeps going from there. Same with paragraphs — add as
many lines as you want.

Apostrophes, quotation marks and ampersands are all fine. Write the way you'd
normally write.

## Three things you do need to get right

Everything else is forgiving, but these three will stop the page working:

Every piece of text needs quote marks around it. `title: "Veraison Came Early",`
works; `title: Veraison Came Early,` doesn't.

Every line inside an update ends with a comma. The blank block already has them in
the right places, so if you copy it you'll be fine.

Each update starts with `{` and ends with `},`. Copying the whole blank block
between the dashed lines takes care of this too.

## If something looks wrong

**The Grapevine page has gone blank.** There's a typo in `posts.js`, almost always
a missing quote mark or comma. Nothing is lost. Go to `posts.js`, click **History**
at the top, open your most recent change and click **Revert** — the page comes
straight back and you can have another go.

**A photo shows a dashed box saying "Photo not found".** The file name in
`posts.js` doesn't match the real file. Open the `images` folder and compare them
character by character, capital letters included. Only that one photo is affected;
the rest of the page is fine.

**Nothing's changed after a couple of minutes.** Hold Shift and click refresh.

Anything else, give me a shout.
