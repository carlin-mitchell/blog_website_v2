const today = new Date();

exports.getDate = () => {
    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }
    return today.toLocaleDateString("en-us", options);
}