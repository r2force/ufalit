"""Hide mailto targets in built HTML until a visitor activates the contact button."""

from html import escape, unescape
from html.parser import HTMLParser
from urllib.parse import unquote


LABEL = "Написать письмо"


class EmailContacts(HTMLParser):
    def __init__(self, source):
        super().__init__(convert_charrefs=False)
        self.source = source
        self.offsets = [0]
        for line in source.split("\n"):
            self.offsets.append(self.offsets[-1] + len(line) + 1)
        self.contact = None
        self.replacements = []
        self.feed(source)
        self.close()
        if self.contact:
            raise ValueError("unclosed mailto link")

    def position(self):
        line, column = self.getpos()
        return self.offsets[line - 1] + column

    def handle_starttag(self, tag, attrs):
        if tag != "a":
            return
        href = (dict(attrs).get("href") or "").strip()
        if not href.lower().startswith("mailto:"):
            return
        start = self.position()
        self.contact = (start, start + len(self.get_starttag_text()), href, attrs)

    def handle_endtag(self, tag):
        if tag != "a" or self.contact is None:
            return
        start, label_start, href, attrs = self.contact
        label = self.source[label_start:self.position()]
        if not label.strip() or "@" in unquote(unescape(label)) or "mailto:" in unescape(label).lower():
            label = LABEL
        attributes = []
        classes = ["email-contact"]
        for key, value in attrs:
            if key in {"href", "type", "role", "target", "rel", "download", "data-email-contact"} or key.startswith("on"):
                continue
            if value and ("@" in unquote(value) or "mailto:" in value.lower()):
                # Addresses may also occur in title, aria-label or data attributes.
                if key not in {"title", "aria-label"}:
                    continue
                value = LABEL
            if key == "class":
                classes.extend((value or "").split())
            else:
                attributes.append(f' {key}' + (f'="{escape(value, quote=True)}"' if value is not None else ""))
        attributes.append(f' class="{escape(" ".join(classes), quote=True)}"')
        token = href.encode("utf-8").hex()
        replacement = (f'<button type="button" data-email-contact="{token}"{"".join(attributes)}>{label}</button>'
                       '<noscript> (Включите JavaScript, чтобы написать письмо.)</noscript>')
        end = self.source.index(">", self.position()) + 1
        self.replacements.append((start, end, replacement))
        self.contact = None


def protect_email_links(source):
    """Leave all other markup byte-for-byte intact, including scripts and comments."""
    parser = EmailContacts(source)
    for start, end, replacement in reversed(parser.replacements):
        source = source[:start] + replacement + source[end:]
    return source
