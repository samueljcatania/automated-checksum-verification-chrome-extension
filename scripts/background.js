chrome.downloads.onChanged.addListener(downloadDelta => {
    if (downloadDelta.state && downloadDelta.state.current === 'complete') {
        // Get more details about the completed download
        chrome.downloads.search({id: downloadDelta.id}, results => {
            if (results && results[0]) {
                const fileUrl = results[0].url;
                // Call function to handle file checksum calculation
                calculateChecksumForDownloadedFile(fileUrl).then(() => {
                    chrome.notifications.create({
                        type: 'basic',
                        iconUrl: 'icon.png',
                        title: 'Download Complete',
                        message: 'Click to view checksums',
                        priority: 2
                    });
                });
            }
        });


    }
});


async function fetchFileContents(fileUrl) {
    try {
        const response = await fetch(fileUrl);
        return await response.arrayBuffer();
    } catch (error) {
        console.error('Error fetching file:', error);
    }
}


async function calculateChecksumForDownloadedFile(fileUrl) {
    const fileContents = await fetchFileContents(fileUrl);
    if (fileContents) {
        const checksums = {
            sha1: await calculateChecksum('SHA-1', fileContents),
            sha256: await calculateChecksum('SHA-256', fileContents),
            sha512: await calculateChecksum('SHA-512', fileContents)
        };

        // Display checksums
        console.log('SHA-1 Checksum:', checksums.sha1);
        console.log('SHA-256 Checksum:', checksums.sha256);
        console.log('SHA-512 Checksum:', checksums.sha512);
    }
}


/**
 * Calculate the checksum of a given array buffer using the given algorithm.
 * @param {string} algorithm The hash algorithm to use.
 * @param {ArrayBuffer} arrayBuffer The array buffer to hash.
 * @returns {Promise<string>} The checksum of the array buffer.
 */
async function calculateChecksum(algorithm, arrayBuffer) {
    // Calculate the hash
    const hashBuffer = await crypto.subtle.digest(algorithm, arrayBuffer);

    // Convert the hash to a hexadecimal string
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}