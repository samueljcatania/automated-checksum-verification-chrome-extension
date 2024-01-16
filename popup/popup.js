document.addEventListener('DOMContentLoaded', function () {
    chrome.runtime.sendMessage({message: "getChecksums"}, function (response) {
        if (response) {
            document.getElementById('sha1Checksum').textContent = response.sha1;
            document.getElementById('sha256Checksum').textContent = response.sha256;
            document.getElementById('sha512Checksum').textContent = response.sha512;
            // Handle other checksums as needed
        } else {
            document.getElementById('sha1Checksum').textContent = 'No checksum calculated yet.';
            document.getElementById('sha256Checksum').textContent = 'No checksum calculated yet.';
            document.getElementById('sha512Checksum').textContent = 'No checksum calculated yet.';
        }
    });
});
