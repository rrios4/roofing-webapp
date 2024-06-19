using System;
using System.Collections.Generic;

namespace server.Models.Supabase;

public partial class S3MultipartUpload
{
    public string Id { get; set; } = null!;

    public long InProgressSize { get; set; }

    public string UploadSignature { get; set; } = null!;

    public string BucketId { get; set; } = null!;

    public string Key { get; set; } = null!;

    public string Version { get; set; } = null!;

    public string? OwnerId { get; set; }

    public DateTime CreatedAt { get; set; }

    public virtual Bucket Bucket { get; set; } = null!;

    public virtual ICollection<S3MultipartUploadsPart> S3MultipartUploadsParts { get; set; } = new List<S3MultipartUploadsPart>();
}
