<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>WIMT Evaluation Studio · Sign in</title>
<style>
  /* ==========================================================
     Colors ek jagah rakhe hain, taaki baad mein badalna aasan ho
     ========================================================== */
  :root {
    --bg-red: #501313;        /* poore page ka fixed dark red background */
    --red-900: #791F1F;
    --red-700: #A32D2D;       /* button aur accents */
    --red-100: #FCEBEB;
    --gold: #FAC775;          /* card ka curved panel */
    --gold-soft: #FAEEDA;
    --gold-deep: #854F0B;
    --ink: #2C2C2A;
    --card-bg: #FFFFFF;
  }

  html, body {
    height: 100%;
    margin: 0;
  }

  body {
    background: var(--bg-red);
    font-family: "Segoe UI", system-ui, -apple-system, Roboto, "Helvetica Neue", Arial, sans-serif;
    overflow: hidden; /* background fixed hai, isliye page scroll nahi hona chahiye */
  }

  /* Animated background: poori screen cover karta hai, clicks card tak jaate hain */
  #bg {
    position: fixed;
    inset: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
    pointer-events: none;
  }

