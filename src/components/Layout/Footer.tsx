export default function Footer(props: any) {
  return (
    <footer className="text-center py-4">
      {" "}
      {/* Center text and apply padding */}
      <a
        href="https://www.openfort.xyz"
        className="text-blue-600 hover:text-blue-800 visited:text-purple-600"
        target="_blank" // Open the link in a new tab
        rel="noopener noreferrer" // Security for opening links in a new tab
      >
        openfort.xyz
      </a>
    </footer>
  );
}
