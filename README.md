Collapsible sidebar ka matlab hai ek vertical navigation panel jiske do states hote hain:

Expanded — icon + text label dono dikhte hain (roughly 240–280px wide)
Collapsed — sirf icons dikhte hain (roughly 64–80px wide)

Toggle button dabane par ek state se doosre state me smooth transition hota hai. Figma me actual code nahi hota, isliye yeh "transition" ek prototype trick se banaya jata hai — do alag designs banao, aur Figma ko bolo ki inke beech animate kare.

Steps

Auto Layout lagao — Sidebar frame par vertical auto layout, aur har menu item par horizontal auto layout (icon + label, 12px gap). Yeh isliye zaroori hai kyunki jab width change hogi to items ko khud adjust hona chahiye, warna har cheez manually move karni padegi.
Menu item ka component banao — Ek hi item ko component banao aur uske variants banao: state = default / hover / active. Icon ko fixed 24×24 rakho aur label ko "hug contents" par.
Do sidebar versions banao — Sidebar/Expanded aur Sidebar/Collapsed. Dono ko select karke Combine as variants kar do, property ka naam expanded = true / false rakh do.
Collapsed version me label ko delete mat karo — uski jagah opacity 0 kar do ya width 0. Yeh isliye, kyunki Smart Animate un layers ko hi interpolate karta hai jinke naam dono variants me same hote hain. Agar layer delete kar diya to text pop hokar gayab hoga, smoothly fade nahi hoga.
Toggle interaction jodo — Hamburger/chevron icon par: On click → Change to → Sidebar/Collapsed, animation Smart Animate, easing Ease Out, duration ~300ms. Collapsed variant me ulta interaction laga do taaki wapas expand ho sake.
Naya tareeka (Variables) — Figma ke newer versions me ek boolean variable isExpanded bana sakte ho, use sidebar ki width aur label ki visibility se bind kar do, aur button par Set variable → toggle laga do. Isse do variants maintain karne ki zaroorat hi nahi padti, kyunki ek hi frame apne aap dono states handle kar leta hai.
