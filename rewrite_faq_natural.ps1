# Run from inside dj-timkey-experience\

$path = ".\src\chapters\FAQ.jsx"
$content = Get-Content -Raw $path

$oldFaqs = @'
const FAQS = [
  {
    q: "What kind of music does DJ TIMKEY play?",
    a: "Open format - Afrobeats, Amapiano, Gengetone, Afro House, Hip-Hop, Dancehall and more. He reads the room and blends genres live rather than sticking to one lane.",
  },
  {
    q: "How do I book him for my event?",
    a: "Use the booking form below, or reach out directly via WhatsApp or email with your date, venue, and event type. He'll get back to you to confirm details.",
  },
  {
    q: "How far in advance should I book?",
    a: "As early as possible - popular dates, especially weekends and wedding season, fill up fast. A few weeks' notice is ideal, but reach out even for last-minute events.",
  },
  {
    q: "What types of events does he play?",
    a: "Clubs, weddings, corporate functions, campus events, brand activations, private parties - pretty much anything that needs the right music at the right moment.",
  },
  {
    q: "Can I request specific songs?",
    a: "Yes - send your requests ahead of time or on the night, and he'll work them naturally into the set.",
  },
  {
    q: "Does he travel outside his home city?",
    a: "Yes, he's open to travel for the right event - just mention your location when you reach out so travel details can be worked out.",
  },
  {
    q: "What's the payment process?",
    a: "Details are shared once you reach out with your event info - typically a deposit secures the date, with the balance due closer to the event.",
  },
]
'@

$newFaqs = @'
const FAQS = [
  {
    q: "What kind of music does DJ TIMKEY play?",
    a: "No fixed lane. Afrobeats, Amapiano, Gengetone, Afro House, Hip-Hop, Dancehall - he plays whatever the crowd is actually feeling that night, not a set list decided beforehand.",
  },
  {
    q: "How do I book him?",
    a: "Fill in the form below or just hit him up on WhatsApp with your date, venue and what kind of event it is. Fastest way to actually get a reply.",
  },
  {
    q: "How early should I lock in a date?",
    a: "The sooner the better, honestly. Weekends and December fill up quick. If it's short notice though, still ask - sometimes it works out.",
  },
  {
    q: "What kind of events does he do?",
    a: "Clubs, weddings, corporate stuff, campus events, brand activations, private parties. If it needs a DJ who can read the room, that's the job.",
  },
  {
    q: "Can I request songs?",
    a: "Always. Send them before the event or just shout them out on the night - he'll find a way to fit them in.",
  },
  {
    q: "Does he travel for gigs outside Nairobi?",
    a: "Yes. Just mention where the event is when you reach out and travel gets sorted from there.",
  },
  {
    q: "How does payment work?",
    a: "Usually a deposit to hold the date, balance closer to the event. Exact details get worked out once you reach out with your event info.",
  },
]
'@

if ($content -notmatch [regex]::Escape($oldFaqs)) {
    Write-Host "Could not find the FAQS array - no changes made. Paste FAQ.jsx back if this happens." -ForegroundColor Red
} else {
    $content = $content.Replace($oldFaqs, $newFaqs)
    [System.IO.File]::WriteAllText((Resolve-Path $path), $content, (New-Object System.Text.UTF8Encoding $false))
    Write-Host "FAQ.jsx rewritten in a more natural, conversational voice." -ForegroundColor Green
}
